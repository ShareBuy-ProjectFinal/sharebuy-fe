import { Table, TableProps } from 'antd';
import type { Reference } from 'rc-table';
import React from 'react';

const TableCustom = (
  props: React.PropsWithChildren<TableProps> & React.RefAttributes<Reference>,
) => {
  const { columns, ...p }: any = props;
  const columnsCustom = columns?.map((column: any) => {
    return {
      ...column,
      render: (text: any, record: any, index: number) => {
        return column.render
          ? (column.render(text, record, index) ?? '-')
          : (text ?? '-');
      },
    };
  });
  return (
    <Table
      // rowKey={(record) => record.id}
      scroll={{ x: 175 }}
      size="middle"
      {...props}
      pagination={
        p.pagination == false
          ? false
          : {
              size: 'default',
              showTotal: (total) => `Tổng ${total} kết quả`,
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSizeOptions: ['5', '10', '15', '20'],
              className: `paginationCustom2 ${p.pagination?.className}`,
              ...props.pagination,
            }
      }
      columns={columnsCustom}
    />
  );
};

export default TableCustom;
