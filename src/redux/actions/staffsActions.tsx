import Api from '../../services/api'
import config from '../../config'
import { Dispatch } from 'redux'

interface MainPair {
  pair_id?: string
  detailed_id?: string
}
interface Staff {
  id_staff?: number
  first_name: string
  last_name: string
  email: string
  position?: string
  post?: string
  status?: string
  main_pair: MainPair
}

interface Params {
  has_more?: boolean
  page?: number
  items_per_page?: number
  sort_by?: string
  sort_order?: string
  sort_order_rev?: string
  total_items?: string
  lang_code?: string
}

interface FetchStaffs {
  data: {
    staffs: Staff
    params: Params
  }
}

export function fetchStaffs(
  id: string = '',
  params: Params = { page: 1, items_per_page: 20 }
) {
  console.log('d')
  return async (dispatch: Dispatch): Promise<FetchStaffs> => {
    try {
      const response = await Api.get(`/sra_staffs/${id}`, { params })
      return response.data
    } catch (error: any) {
      return error
    }
  }
}

export function createStaff(formData: FormData) {
  return (dispatch: Dispatch) => {
    const response = fetch(`${config.baseUrl}sra_staffs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Storefront-Api-Access-Key': `${config?.apiKey}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        return response
      })
      .catch(error => {
        return error
      })
  }
}
