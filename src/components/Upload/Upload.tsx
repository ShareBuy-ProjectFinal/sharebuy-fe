import { Input, Row, Space } from 'antd';
import classNames from 'classnames/bind';
import { memo, useState } from 'react';
import * as XLSX from 'xlsx';

import styles from './Upload.module.scss';

const cx = classNames.bind(styles);

export interface IHeader {
  dataIndexRow: string[];
  headerRow: string[];
}

interface IProps {
  setData(data: unknown[], header: IHeader, file: File): void;
  fileName: string;
  setFileName: React.Dispatch<string>;
  className?: string;
  keyUpload: {
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
  };
}

export const Upload = memo(
  ({ fileName, className, keyUpload, setFileName, setData }: IProps) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (!e.target.files) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (!event.target) return;

          const workbook = XLSX.read(event.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData: any = XLSX.utils.sheet_to_json(sheet);

          const rowObject: any = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            {
              header: 1,
              defval: '',
            },
          );

          const headerObj = {
            dataIndexRow: rowObject[0] as string[],
            headerRow: rowObject[0] as string[],
          };

          setFileName(file.name);
          setData(
            sheetData
              .map((item: any) => {
                const newItem: any = {};

                Object.keys(item).map((key) => {
                  const newKey = key.trim();
                  newItem[newKey] = item[key];
                });

                return newItem;
              })
              .map((data: any) =>
                rowObject[0].map((key: string) =>
                  typeof data[key] !== 'undefined'
                    ? typeof data[key] === 'boolean'
                      ? data[key].toString().toUpperCase()
                      : data[key]
                    : '',
                ),
              ),
            headerObj,
            file,
          );

          keyUpload.setState(Date.now());
        };
        reader.readAsBinaryString(file);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Space className={`${className} w-full items-center`}>
        <Input
          placeholder="Chọn định dạng .xlsx"
          value={fileName}
          className={cx('rounded-[12px] py-[8px]', 'input-upload')}
        />
        <Row>
          <Input
            key={keyUpload.state}
            id="upload"
            className="max-w-[1px] p-0 m-0 overflow-hidden opacity-0"
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
          />
        </Row>
        <Row>
          <label
            htmlFor="upload"
            className="cursor-pointer px-[20px] py-[8px] border-solid border-primary border-[1px] rounded-[8px] font-bold text-primary hover:bg-primary hover:text-white transition select-none"
          >
            Browser
          </label>
        </Row>
      </Space>
    );
  },
);
