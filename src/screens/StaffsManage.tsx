import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Utils
import i18n from '../utils/i18n'
import { getImagePath } from '../utils'

// Actions
import * as staffsActions from '../redux/actions/staffsActions'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  infoStaff: {
    flexDirection: 'column'
  },
  postPositionRow: {
    flexDirection: 'row'
  },
  staffName: {
    marginBottom: 3,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  staffPostPosition: {
    marginVertical: 15,
    fontSize: 15,
    color: 'black',
    textAlign: 'left'
  },
  staffEmail: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'left'
  },
  productItemImage: {
    margin: 10,
    width: 100,
    height: 100
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  emptySubText: {
    fontSize: 14,
    color: '#888'
  }
})
type Sex = 'man' | 'woman'
interface Staff {
  id_staff: number
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  sex: Sex
  position?: string
  post?: string
  description?: string
  country?: string
  state?: string
  city?: string
  address?: string
  address_index?: number
}
interface FetchStaffs {
  staffs?: Staff[]
  params?: {
    has_more: boolean
  }
}

export const StaffsManage = ({ staffsActions, navigation, route }: any) => {
  const [page, setPage] = useState<number>(1)
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [scrollBegin, setScrollBegin] = useState<boolean>(false)

  useEffect(() => {
    if (route.params?.refresh) {
      setPage(1)
      setStaffs([])
      fetchStaffs()
      setHasMore(true)
      navigation.setParams({ refresh: false })
    }
  }, [route.params?.refresh])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(1)
    setStaffs([])
    setHasMore(true)
    fetchStaffs()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => {
            navigation.navigate('StaffDetail')
          }}
          title={i18n.t('Add')}
        />
      )
    })
    fetchStaffs()
  }, [])
  const handleEndReached = () => {
    if (hasMore && scrollBegin) {
      fetchStaffs()
    }
  }
  const fetchStaffs = async () => {
    const staffData: FetchStaffs = await staffsActions.fetchStaffs('', {
      page: page
    })
    if (staffData?.staffs) setStaffs(staffs.concat(staffData.staffs))
    if (staffData?.params) setHasMore(staffData.params.has_more)
    setPage(page + 1)
  }

  return (
    <FlatList
      data={staffs ? staffs : []}
      onEndReached={() => handleEndReached()}
      keyExtractor={item => String(item?.id_staff)}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StaffDetail', { idStaff: item?.id_staff })
          }}>
          <View style={styles.container}>
            <Image
              source={
                getImagePath(item)
                  ? { uri: getImagePath(item) }
                  : require('../assets/no_image.png')
              }
              style={styles.productItemImage}
            />
            <View style={styles.infoStaff}>
              <Text style={styles.staffName}>
                {item.first_name} {item.last_name}
              </Text>
              {!!item.email && (
                <Text style={styles.staffEmail}>{item.email}</Text>
              )}
              <View style={styles.postPositionRow}>
                {!!item.position && (
                  <Text style={styles.staffPostPosition}>
                    {i18n.t('Position')}: {i18n.t(String(item.position) + ' ')}
                  </Text>
                )}
                {!!item.post && (
                  <Text style={styles.staffPostPosition}>
                    {i18n.t('Post')}: {i18n.t(String(item.post))}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{i18n.t('No data to display')}</Text>
          <Text style={styles.emptySubText}>
            {i18n.t('Try adding some staff!')}
          </Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => {
        setScrollBegin(true)
      }}
    />
  )
}

export default connect(null, dispatch => ({
  staffsActions: bindActionCreators(staffsActions, dispatch)
}))(StaffsManage)
