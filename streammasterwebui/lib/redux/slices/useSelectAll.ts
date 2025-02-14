import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../lib/redux/store'
import { setSelectAllInternal } from './selectAllSlice'

export const useSelectAll = (typename: string) => {
  const dispatch: AppDispatch = useDispatch()

  const setSelectAll = (isSelectAll: boolean) => {
    dispatch(
      setSelectAllInternal({
        isSelectAll: isSelectAll,
        typename,
      }),
    )
  }

  const selectAll = useSelector(
    (rootState: RootState) => rootState.selectAll[typename],
  )

  return { selectAll, setSelectAll }
}
