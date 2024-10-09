import { useDebounce } from '@uidotdev/usehooks';
import { SelectProps, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import SelectForm from 'components/Input/SelectForm';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { icons } from 'utils/icons';

export interface ILazySelectData {
  totalItems: number;
  options: DefaultOptionType[];
  hasNextPage?: boolean;
}

export interface ILazySelectParams {
  pageSize: number;
  value?: string;
}

export const initLazySelectData: ILazySelectData = {
  options: [],
  totalItems: 0,
};

type IProps = {
  customeSize?: number;
  data: ILazySelectData;
  customeNextSize?: number;
  hasNextPage?: boolean;
  onSelectScrollChange: (params: ILazySelectParams) => void;
  onClear?: () => void;
} & SelectProps;

const { LoadingOutlined } = icons;

const LazySelectForm = ({
  hasNextPage,
  data,
  customeSize = 10,
  customeNextSize = 10,
  onSelectScrollChange,
  onClear,
  ...props
}: IProps) => {
  const { loading } = props;

  const initRouteCbParams: ILazySelectParams = useMemo(
    () => ({
      value: '',
      pageSize: customeSize,
    }),
    [customeSize],
  );

  const [searchValue, setSearchValue] = useState('');
  const [params, setParams] = useState<ILazySelectParams>(initRouteCbParams);

  const searchDebounce = useDebounce(searchValue, 500);

  useEffect(() => {
    const newParams = handleSetParams('value', searchDebounce.trim());

    setParams(newParams);
    onSelectScrollChange(newParams);
  }, [searchDebounce]);

  const handleSetParams = useCallback(
    (field: keyof ILazySelectParams, value: string | number) => {
      const newParams: ILazySelectParams = {
        ...params,
        [field]: value,
      };

      return newParams;
    },
    [params],
  );

  const handleOnScroll = (event: any) => {
    if (typeof hasNextPage === 'boolean' && !hasNextPage) return;

    const target = event.target;
    const item = target.querySelector('.ant-select-item-option');

    const height = target.scrollTop + target.offsetHeight,
      totalItemsHeight = item.offsetHeight * data.totalItems;

    if (Math.ceil(totalItemsHeight) === target.scrollHeight) return;

    if (Math.ceil(height + 8) >= target.scrollHeight) {
      target.scrollTo(0, target.scrollHeight);

      setTimeout(() => {
        const newParams = handleSetParams(
          'pageSize',
          params.pageSize + customeNextSize,
        );

        setParams(newParams);
        onSelectScrollChange(newParams);
      }, 500);
    }
  };

  const handleClearInput = () => {
    onClear?.();

    const newParams = handleSetParams('value', '');

    setParams(newParams);
    onSelectScrollChange(newParams);
  };

  const handleSelect = () => {
    const newParams = handleSetParams('value', '');

    setParams(newParams);
    onSelectScrollChange(newParams);
  };

  return (
    <SelectForm
      loading={loading}
      filterOption={false}
      onSelect={handleSelect}
      onClear={handleClearInput}
      onPopupScroll={handleOnScroll}
      onSearch={(value) => setSearchValue(value)}
      options={data.options.filter((item) => item.value)}
      dropdownRender={(menu) => (
        <>
          <div>{menu}</div>
          {loading && (
            <div className="flex px-3 py-[5px] items-center gap-2">
              <Spin
                size="small"
                className="w-max"
                indicator={<LoadingOutlined spin />}
              />
              <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                Load more...
              </span>
            </div>
          )}
        </>
      )}
      {...props}
    />
  );
};

export default memo(LazySelectForm);
