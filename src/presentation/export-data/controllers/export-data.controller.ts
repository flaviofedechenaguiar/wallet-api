import {
  Controller,
  Get,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Response } from 'express';
import { SQLiteWalletEntity } from 'src/domain/wallets/models/wallet.model';
import { AuthGuard } from 'src/presentation/users/guards/auth.guard';
import { buildDate } from 'src/utils/GetFirstAndLastDateOfMonth';
import { DataSource } from 'typeorm';
import * as XLSX from 'xlsx';

@Controller('export-data')
export class ExportDataController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);

  @UseGuards(AuthGuard)
  @Get()
  async exports(
    @Res() res: Response,
    @Request() request: Request,
    @Query('start_date') startDateParam: string,
    @Query('end_date') endDateParam: string,
    @Query('wallet_id') walletId: string,
  ) {
    const userId = request['userId'];
    walletId = walletId || '0';

    const [startDate, endDate] = [
      buildDate(startDateParam).toISOString().split('T')[0],
      buildDate(endDateParam).toISOString().split('T')[0],
    ];

    const wallets = await this.walletRepository
      .createQueryBuilder('wallet')
      .innerJoinAndSelect('wallet.transactions', 'transaction')
      .where('wallet.id = :id AND wallet.user_id = :userId', {
        id: walletId,
        userId: +userId,
      })
      .andWhere('date(transaction.date) BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      })
      .getMany();

    const mapToSpreadData = function (data: SQLiteWalletEntity[]): any[] {
      const spreadData = [];

      function buildTransactionData(data: SQLiteWalletEntity[]): any[] {
        const rows = [
          [
            'Carteira',
            'Valor Total',
            'Descricao da Transacao',
            'Valor da Transacao',
            'Data da Transacao',
            'Status da Transacao',
          ],
        ];

        const transactionRows = data.reduce((acc, wallet) => {
          const transactions = wallet.transactions.reduce(
            (acc, transaction) => {
              acc.push([
                wallet.description,
                wallet.amount,
                transaction.description,
                transaction.amount,
                transaction.date.toISOString().split('T')[0],
                transaction.status,
              ]);

              return acc;
            },
            [],
          );

          return [...acc, ...transactions];
        }, []);

        rows.push(...transactionRows);
        return rows;
      }

      spreadData.push(...buildTransactionData(data));
      return spreadData;
    };

    function fixWidth(worksheet: XLSX.WorkSheet) {
      const data = XLSX.utils.sheet_to_json<any>(worksheet);
      const colLengths = Object.keys(data[0]).map((k) => k.toString().length);
      for (const d of data) {
        Object.values(d).forEach((element: any, index) => {
          const length = element.toString().length;
          if (colLengths[index] < length) {
            colLengths[index] = length;
          }
        });
      }
      worksheet['!cols'] = colLengths.map((l) => {
        return {
          wch: l,
        };
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(mapToSpreadData(wallets));
    if (wallets.length) {
      fixWidth(ws);
    }
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `export-data-${new Date().getTime()}`);

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `export -data - ${new Date().getTime()}.xlsx`,
    );
    res.type('application/octet-stream');
    res.send(wbout);
  }
}
