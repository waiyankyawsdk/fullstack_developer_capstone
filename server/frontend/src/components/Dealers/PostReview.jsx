import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Dealers.css'
import '../assets/style.css'
import Header from '../Header/Header'

const PostReview = () => {
  const [dealer, setDealer] = useState({})
  const [review, setReview] = useState('')
  const [model, setModel] = useState()
  const [year, setYear] = useState('')
  const [date, setDate] = useState('')
  const [carmodels, setCarmodels] = useState([])

  const curr_url = window.location.href
  const root_url = curr_url.substring(0, curr_url.indexOf('postreview'))
  const params = useParams()
  const id = params.id
  const dealer_url = root_url + `djangoapp/dealer/${id}`
  const review_url = root_url + 'djangoapp/add_review'
  const carmodels_url = root_url + 'djangoapp/get_cars'

  const postreview = async () => {
    let name = sessionStorage.getItem('firstname') + ' ' + sessionStorage.getItem('lastname')
    // If the first and second name are stores as null, use the username
    if (name.includes('null')) {
      name = sessionStorage.getItem('username')
    }
    if (!model || review === '' || date === '' || year === '' || model === '') {
      alert('All details are mandatory')
      return
    }

    const model_split = model.split(' ')
    const make_chosen = model_split[0]
    const model_chosen = model_split[1]

    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year
    })

    console.log(jsoninput)
    const res = await fetch(review_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsoninput
    })

    const json = await res.json()
    if (json.status === 200) {
      window.location.href = window.location.origin + '/dealer/' + id
    }
  }
  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: 'GET'
    })
    const retobj = await res.json()

    if (retobj.status === 200) {
      const dealerobjs = Array.from(retobj.dealer)
      if (dealerobjs.length > 0) { setDealer(dealerobjs[0]) }
    }
  }

  const get_cars = async () => {
    const res = await fetch(carmodels_url, {
      method: 'GET'
    })
    const retobj = await res.json()

    const carmodelsarr = Array.from(retobj.CarModels)
    setCarmodels(carmodelsarr)
  }
  useEffect(() => {
    get_dealer()
    get_cars()
  }, [])

  return (
    <div>
      <Header />
      <div style={{ margin: '5%' }}>
        <h1 style={{ color: 'darkblue' }}>{dealer.full_name}</h1>
        <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)} />
        <div className='input_field'>
          Purchase Date <input type='date' onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className='input_field'>
          Car Make
          <select name='cars' id='cars' onChange={(e) => setModel(e.target.value)}>
            <option value='' selected disabled hidden>Choose Car Make and Model</option>
            {carmodels.map(carmodel => (
              <option value={carmodel.CarMake + ' ' + carmodel.CarModel}>{carmodel.CarMake} {carmodel.CarModel}</option>
            ))}
          </select>
        </div>

        <div className='input_field'>
          Car Year <input type='int' onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />
        </div>

        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  )
}
export default PostReview
