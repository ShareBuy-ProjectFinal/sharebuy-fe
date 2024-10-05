import dayjs from 'dayjs';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import * as XLSX from 'xlsx';
import formatNumber, { formatDate } from './function';

interface IMergeData {
  start: number;
  count: number;
  title: string;
}

export const exportExcel_v2 = (
  headerRow: ColumnsTypeCustom,
  // headerRow: any[],
  datas: any,
  fileName = 'download',
  isShowSTT = true,
  format?: number,
) => {
  exportExcelWithManySheet(
    [{ headerRow, data: datas, isShowSTT, format }],
    fileName,
  );
};

export const exportExcelWithManySheet = (
  sheets: {
    headerRow: ColumnsTypeCustom;
    data: any;
    isShowSTT?: boolean;
    sheetName?: string;
    format?: number;
  }[],
  fileName = 'download',
) => {
  const preprocessingSheets = sheets.map((sheet, index) => ({
    ...sheet,
    isShowSTT: sheet.isShowSTT ?? true,
    sheetName: sheet.sheetName ?? `Sheet ${index + 1}`,
  }));

  const wb = XLSX.utils.book_new();

  preprocessingSheets.forEach((sheet) => {
    const { headerRow, isShowSTT, data, sheetName } = sheet;

    let index = 0;
    const headerRowFilter = headerRow.filter(
      (column: any) =>
        column?.isShow !== false &&
        ((column?.dataIndex !== '' &&
          column?.dataIndex !== null &&
          column?.dataIndex !== undefined) ||
          column?.children) &&
        (Array.isArray(column?.dataIndex) ||
          column?.dataIndex?.toLowerCase() !== 'stt'),
    );
    isShowSTT &&
      headerRowFilter.unshift({
        title: 'STT',
        dataIndex: 'stt',
        type: 'number',
      });

    let isMergeCell = false;
    const mergeData: IMergeData[] = [];

    const preprocessHeaderFilter = headerRowFilter.reduce(
      (prevValue: any[], currValue: any) => {
        if (currValue?.children) {
          isMergeCell = true;
          mergeData.push({
            start: prevValue.length,
            count: currValue.children.length,
            title: currValue.title,
          });

          return [
            ...prevValue,
            ...currValue.children.map((column: any) => column),
          ];
        }

        return [...prevValue, currValue];
      },
      [],
    );

    const dataExport: any[] = [
      preprocessHeaderFilter.map((column: any) => column?.title),
    ];

    if (isMergeCell)
      dataExport.unshift(new Array(dataExport[0].length).fill(''));

    data.length != 0 &&
      data.forEach((data: any) => {
        const rowData = preprocessHeaderFilter.map((column: any) => {
          const value = getValueByDataIndex(data, column?.dataIndex);

          switch (column.dataIndex) {
            case 'stt':
              return ++index;
            default:
              if (column?.isShowRender && column?.children)
                return column.render(value, data, index);

              if (column?.isShowRender && column.render)
                return column.render(value, data, index);

              if (column?.type == 'date' && dayjs(value).isValid())
                return formatDate(value, column.formatDate);

              if (column?.type == 'number') {
                if (value === null || value === undefined || value === '')
                  return '-';

                const result = checkUnit(value, column?.unit);
                const resultNumber = Number(
                  result.replace(/\./g, '').replace(/,/g, '.'),
                );

                if (Number.isNaN(resultNumber)) return result;

                return resultNumber;
              }

              if (!isNaN(parseFloat(value)))
                return checkUnitCurrency(value, column.unit, column.currency);

              if (value === null || value === undefined || value === '')
                return '';

              return value;
          }
        });
        dataExport.push(rowData);
      });

    const ws = XLSX.utils.aoa_to_sheet(dataExport);

    const sheetRange = ws['!ref'];

    if (sheetRange) {
      const range = XLSX.utils.decode_range(sheetRange);

      headerRowFilter.forEach((column: any, index: number) => {
        if (column?.type !== 'number') return;

        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const cell_ref = XLSX.utils.encode_cell({ r: R, c: index }); // Cột tuổi là cột thứ 2 (index 1)
          if (!ws[cell_ref]) continue;
          if (typeof ws[cell_ref].v !== 'number') continue;

          ws[cell_ref].t = 'n';

          if (column.unit || column.currency) {
            ws[cell_ref].z = '#,##0';

            // if (sheet.format) {
            //   ws[cell_ref].z =
            //     `#,##0.${new Array(sheet.format).fill('0').join('')}`;
            // } else if (column.format) {
            //   ws[cell_ref].z =
            //     `#,##0.${new Array(column.format).fill('0').join('')}`; // Định dạng số với 2 chữ số thập phân
            // } else if (Number.isInteger(ws[cell_ref].v))
            //   ws[cell_ref].z = '#,##0'; // Định dạng số
            // else ws[cell_ref].z = '#,##0.00'; // Định dạng số với 6 chữ số thập phân
          } else if (Number.isInteger(ws[cell_ref].v)) {
            ws[cell_ref].z = '0'; // Định dạng số với 2 chữ số thập phân
          } else {
            ws[cell_ref].z = '0.00'; // Định dạng số với 2 chữ số thập phân
          }
        }
      });
    }

    if (isMergeCell) {
      mergeData.forEach((item) => {
        ws[`!merges`] = ws[`!merges`] || [];
        ws[`!merges`].push({
          s: { r: 0, c: item.start },
          e: { r: 0, c: item.start + item.count - 1 },
        });

        // Thêm title cho cell merge
        ws[XLSX.utils.encode_cell({ r: 0, c: item.start })] = {
          v: item.title,
          t: 's',
        };
      });

      preprocessHeaderFilter.forEach((column: any, index: number) => {
        if (isInRange(mergeData, index)) return;

        ws[`!merges`] = ws[`!merges`] || [];
        ws[`!merges`].push({
          s: { r: 0, c: index },
          e: { r: 1, c: index },
        });

        // Thêm title cho cell merge
        ws[XLSX.utils.encode_cell({ r: 0, c: index })] = {
          v: column.title,
          t: 's',
        };
      });
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

function getValueByDataIndex(
  data: any,
  dataIndex: string | Array<string | number[]>,
): any {
  // Nếu dataIndex là một chuỗi, chuyển nó thành một mảng với một phần tử
  if (typeof dataIndex === 'string') {
    return data[dataIndex];
  }

  let currentValue = data;
  for (const key of dataIndex) {
    if (Array.isArray(key)) {
      // Nếu key là một mảng, giả sử mảng này chứa chỉ số để truy cập vào mảng
      currentValue = currentValue?.[key?.[0]];
    } else {
      // Truy cập vào object hoặc mảng bằng key hoặc chỉ số
      currentValue = currentValue?.[key];
    }
  }
  return currentValue;
}

function checkUnit(value: any, unit: number) {
  let valueNew = value;
  if (unit) valueNew = (parseFloat(valueNew) / unit).toFixed(6);
  if (checkIsPercent(value))
    return `${parseFloat(value.replace('%', '')).toFixed(1)}%`;
  return formatNumber(valueNew, 'vi-VN', unit);
}

function checkIsPercent(value: any) {
  if (typeof value === 'undefined') return false;

  return value.toString().includes('%');
}

const isInRange = (range: IMergeData[], index: number) => {
  return range.some(
    (item) => index >= item.start && index < item.start + item.count,
  );
};

function checkUnitCurrency(value: any, unit: number, currency?: string) {
  let valueNew = value;
  if (unit) valueNew = valueNew / unit;
  if (currency) valueNew = formatNumber(valueNew, currency || 'vi-VN');
  return valueNew;
}
