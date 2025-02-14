import { type DataTableExpandedRows, type DataTableFilterMeta, type DataTableValue } from 'primereact/datatable';
import { useLocalStorage } from 'primereact/hooks';
import { useState } from 'react';

import { AdditionalFilterProps } from '@lib/common/common';
import { VideoStreamIsReadOnly } from '@lib/iptvApi';
import { useSelectAll } from '@lib/redux/slices/useSelectAll';
import { useSelectedItems } from '@lib/redux/slices/useSelectedItemsSlice';
import { useShowHidden } from '@lib/redux/slices/useShowHidden';
import { useShowSelections } from '@lib/redux/slices/useShowSelections';
import { useSortInfo } from '@lib/redux/slices/useSortInfo';
import { type PagedTableInformation } from './DataSelector';

const useDataSelectorState = <T extends DataTableValue>(id: string, selectedItemsKey: string) => {
  const { sortInfo, setSortInfo } = useSortInfo(id);
  const { selectAll, setSelectAll } = useSelectAll(id);

  const { selectSelectedItems, setSelectSelectedItems } = useSelectedItems<T>(selectedItemsKey);
  const { showHidden } = useShowHidden(id);
  const { showSelections, setShowSelections } = useShowSelections(id);
  const [rowClick, setRowClick] = useLocalStorage<boolean>(false, id + '-rowClick');

  const [pagedInformation, setPagedInformation] = useState<PagedTableInformation>();
  const [prevDataSource, setPrevDataSource] = useState<T[] | undefined>(undefined);
  const [dataSource, setDataSource] = useState<T[]>();
  const [first, setFirst] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [additionalFilterProps, setAdditionalFilterProps] = useState<AdditionalFilterProps | undefined>(undefined);

  const [rows, setRows] = useState<number>(25);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>();
  const [videoStreamIsReadOnlys, setVideoStreamIsReadOnlys] = useState<VideoStreamIsReadOnly[]>([]);

  const setSortField = (value: string) => {
    // console.log('setSortField', id, value);
    setSortInfo({ sortField: value });
  };

  const setSortOrder = (value: -1 | 0 | 1) => {
    // console.log('sortOrder', id, value);
    setSortInfo({ sortOrder: value });
  };

  const sortField = sortInfo?.sortField ?? '';
  const sortOrder = sortInfo?.sortOrder ?? 1;

  return {
    setters: {
      setAdditionalFilterProps,
      setDataSource,
      setExpandedRows,
      setFilters,
      setFirst,
      setPage,
      setPagedInformation,
      setPrevDataSource,
      setRowClick,
      setRows,
      setSelectAll,
      setSelectSelectedItems,
      setShowSelections,
      setSortField,
      setSortOrder,
      setVideoStreamIsReadOnlys,
    },
    state: {
      additionalFilterProps,
      dataSource,
      expandedRows,
      filters,
      first,
      page,
      pagedInformation,
      prevDataSource,
      rowClick,
      rows,
      selectAll,
      selectSelectedItems,
      showHidden,
      showSelections,
      sortField,
      sortOrder,
      videoStreamIsReadOnlys,
    },
  };
};

export default useDataSelectorState;
