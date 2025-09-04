import React, { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'



// Utils
import { format } from 'date-fns'
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
        flexDirection: 'column',
      },
      postPositionRow: {
        flexDirection: 'row',
       
      },
      tableCell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
      },
      staffName: {
        marginBottom:3,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left'
      },
      staffPostPosition: {
        marginVertical:15,
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
          margin:10,
          width: 100,
          height: 100
  },

});

export const StaffsManage = ({
  staffsActions,
  settings,
  navigation,
  Staffs: { staffs }
}) => {
 
 let defaultImage = 'https://mobile.mve.demo.cs-cart.com/images/no_image.png'

   useEffect(() => {
          navigation.setOptions({
              headerRight: () => (
                  <Button
                      onPress={()=>{
                        navigation.navigate('AddNewStaff')
                      }}
                      title="Add new"
                  />
              ),
          });
      }, [navigation]);
  useEffect(() => {
   staffsActions.fetchStaffs();
  }, [])
  
    return (
      <>

     
         <FlatList
            data={staffs.staffs}
            keyExtractor={({ id_staff }) => id_staff}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>{
              navigation.navigate('StaffDetail',{idStaff: item.id_staff})
            }}>
            
            <View style={styles.container} >
              
              <Image source={{ uri: getImagePath(item)?getImagePath(item):defaultImage }} style={styles.productItemImage} />
              <View style={styles.infoStaff}> 
                  <Text style={styles.staffName}>{item.first_name} {item.last_name}</Text>
                  <Text style={styles.staffEmail}>{item.email}</Text>
                  <View style={styles.postPositionRow}>
                    <Text style={styles.staffPostPosition}>{i18n.t("Position: ")}{i18n.t(item.position+" ")}</Text>
                    <Text style={styles.staffPostPosition}>{i18n.t("Post: ")}{i18n.t(item.post )}</Text>
                  </View>
              </View>
            </View>
              </TouchableOpacity>
            )}
          />
         
       
      </>
    )
  
}

export default connect(
  state => ({
    Staffs: state.staffs,
    settings: state.settings
  }),
  dispatch => ({
    staffsActions: bindActionCreators(staffsActions, dispatch)
  })
)(StaffsManage)
