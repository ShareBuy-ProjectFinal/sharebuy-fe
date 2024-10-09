import { Table, TableProps } from 'antd';
import type { Reference } from 'rc-table';
import React from 'react';
import { generateUUID } from 'utils/function';

const TableComponent = (
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
      rowKey={(record) =>
        record._id || record.id || record.key || generateUUID()
      }
      scroll={{ x: 'max-content', y: 'max-content' }}
      size="middle"
      rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
      {...props}
      className={`tablecomponent ${p.className}`}
      pagination={
        p.pagination == false
          ? false
          : {
              size: 'default',
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              className: `!mb-0 !mt-5 ${p.pagination?.className}`,
              ...props.pagination,
            }
      }
      columns={columnsCustom}
    />
  );
};

export default TableComponent;
