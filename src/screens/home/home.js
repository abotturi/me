import { useState, useEffect } from 'react'
import './home.css'

import { FiUsers, FiUser } from 'react-icons/fi';
import { FaFax } from 'react-icons/fa';
import { AiOutlineInfoCircle, AiOutlineMail, AiOutlinePhone, AiOutlineEye } from 'react-icons/ai';
import { BsReply } from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { GoLocation } from 'react-icons/go';

import axios from "axios";

const AddressesCard = ({item}) => {
    return(
        <div className='card-menu'>
            <label style={{color: '#aaa', fontSize: '14px'}}>{item.label}</label> <br/>
            <label style={{fontWeight: 500, color: '#555'}}>
                {item.name}
                {
                    item.code != null ?
                        <span style={{color: '#aaa'}}> - (<i>{item.code})</i></span>
                        : null
                }
            </label><br/>
            <label style={{color: '#555', fontSize: '14px'}}>
                <GoLocation className='card-icon' />
                {item.address}
            </label><br/>
            <label style={{color: '#555', fontSize: '14px'}}>
                <FiUser className='card-icon' />
                {item.contact.name}
            </label><br/>
            <label style={{color: '#555', fontSize: '14px'}}>
                <AiOutlineMail className='card-icon' style={{position: 'relative', bottom: '-2px'}} />
                {item.contact.email}
            </label><br/>
            
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <label style={{color: '#555', fontSize: '14px'}}>
                    <AiOutlinePhone className='card-icon' style={{position: 'relative', bottom: '-2px'}} />
                    {item.contact.phone}
                </label>
                <label style={{color: '#555', fontSize: '14px'}}>
                    <FaFax className='card-icon' style={{position: 'relative', bottom: '-2px', marginLeft: '15px'}} />
                    {item.contact.fax}
                </label>
            </div>

        </div>
    )
}

const Home = () => {
    const [loader, setLoader] = useState(true)

    const [addresses, setAddresses] = useState(true)
    const [allAddresses, setAllAddresses] = useState([])

    const [headerData, setHeaderData] = useState(null)
    const [dateCreated, setDateCreated] = useState(null)

    const [dateRead, setDateRead] = useState(null)
    const [dateLast, setDateLast] = useState(null)

    const [supplierData, setSupplierData] = useState(null)

    const loaderData = () => {
        axios.get("https://me-frontend-challenge-api.herokuapp.com/orders/1")
        .then(r => {
            console.log(r.data)
            setAllAddresses(r.data.addresses)
            
            setHeaderData(r.data.header)

            const dateGet = new Date(r.data.header.createdAt)
            setDateCreated(('0' + (dateGet.getMonth() + 1)).slice(-2) +
            '/' + ('0' + dateGet.getDate()).slice(-2) +
            '/' + dateGet.getFullYear())

            setSupplierData(r.data.supplier)

            const dateGetRead = new Date(r.data.supplier.readAt)
            setDateRead(('0' + (dateGetRead.getMonth() + 1)).slice(-2) +
            '/' + ('0' + dateGetRead.getDate()).slice(-2) +
            '/' + dateGetRead.getFullYear() + ' ' +
            ('0' + dateGetRead.getHours()).slice(-2) + ':' + ('0' + dateGetRead.getMinutes()).slice(-2))
            
            const dateGetLast = new Date(r.data.supplier.lastReplyAt)
            setDateLast(('0' + (dateGetLast.getMonth() + 1)).slice(-2) +
            '/' + ('0' + dateGetLast.getDate()).slice(-2) +
            '/' + dateGetLast.getFullYear() + ' ' +
            ('0' + dateGetLast.getHours()).slice(-2) + ':' + ('0' + dateGetLast.getMinutes()).slice(-2))

            setLoader(false)
        })
        .catch(e => console.log(e))
    }

    useEffect(() => {
        loaderData()
    }, [])

    return(
        loader ? 
        <h5>Carregando...</h5>
        :
        <div>
            <header>
                <div style={{paddingTop: 10, paddingBottom: 10, display: 'flex', flexDirection: 'row'}}>

                    <div className='serialME'>
                        <label className="text-purchase">Purchase Order</label> <br/>
                        <label className="text-number">{headerData.number}</label><br/>
                        <label className="text-serial"><i>SerialME {headerData.serial}</i></label>
                    </div>

                    <div className='div-logo'>
                        <img src='https://blog.me.com.br/wp-content/uploads/2018/02/favicon.png' className="img-logo" />
                    </div>
                    
                    <div style={{marginLeft: '-20px'}}>
                        <label className='text-title'>{headerData.buyer}</label>
                        <div style={{marginTop: 5}}>
                            <FiUsers className='icon-text-header' /> 
                            <label className='text-user-info'>{headerData.contact.name}</label>
                            <AiOutlineInfoCircle
                                className='icon-text-header'
                                style={{marginLeft: '5px', color: '#43a9da'}}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginTop: 7}}>
                            <div>
                                <AiOutlineMail className='icon-text-header'style={{position: 'relative', top: '5px'}} /> 
                                <label className='text-user-info'>{headerData.contact.email}</label>
                            </div>
                            <div style={{marginLeft: '10px'}}>
                                <AiOutlinePhone className='icon-text-header' /> 
                                <label className='text-user-info'>{headerData.contact.phone}</label>
                            </div>
                            <div style={{marginLeft: '10px'}}>
                                <FaFax className='icon-text-header' /> 
                                <label className='text-user-info'>{headerData.contact.fax}</label>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{width: '200px', position: 'absolute', right: 50}}>
                        <label className='text-title' style={{float: 'right'}}>
                            {
                                headerData.price.toLocaleString("en-US", 
                                {
                                    style:"currency",
                                    currency:headerData.currency,
                                    currencyDisplay: 'code'
                                })
                            }
                        </label><br/>
                        <label
                            className='text-title'
                            style={{fontSize: '18px', color: '#f5a820', float: 'right', marginTop: 7}}
                        >
                            {headerData.status}
                        </label><br/>
                        <label style={{float: 'right', marginTop: 7}}>Created on {dateCreated}</label>
                    </div>

                </div>
            </header>

            <div className='body-content'>
                <label style={{color: '#aaa', fontWeight: 450}}>Supplier</label>
                <div style={{marginTop: '10px'}}>
                    <label className='name-company' >{supplierData.name}</label>
                    <label className='text-code' >Code #{supplierData.code}</label>
                </div>
                <div className="company-data-menu" >
                    <div style={{maxWidth: '30%'}}>
                        <label style={{color: '#555', fontWeight: 450}}>{supplierData.document.value}</label><br/>
                        <div style={{marginTop: '10px'}}>
                            <label style={{color: '#555', fontWeight: 450}}>{supplierData.address}</label><br/>
                        </div>
                    </div>
                    <div>
                        <label style={{color: '#555', fontWeight: 450}}>
                            <FiUser style={{color: '#aaa'}} /> {supplierData.contact.name} -
                                <span style={{color: '#1797d2'}}> {supplierData.contact.email}</span>
                        </label><br/>
                        <div style={{marginTop: '10px'}}>
                            <label style={{color: '#555', fontWeight: 450}}>
                                <AiOutlinePhone className='icon-company' /> {supplierData.contact.phone} - 
                                <FaFax className='icon-company' style={{marginLeft: '5px'}} />
                                {supplierData.contact.fax}
                            </label><br/>
                        </div>
                    </div>
                    <div>
                        <label style={{color: '#555', fontWeight: 450}}>
                            <AiOutlineEye className='icon-company' style={{fontSize: '20px'}} />
                             Read: {dateRead}
                        </label><br/>
                        <div style={{marginTop: '10px'}}>
                            <label style={{color: '#555', fontWeight: 450}}>
                                <BsReply className='icon-company' style={{fontSize: '20px'}} />
                                Last Reply: {dateLast}
                            </label><br/>
                        </div>
                    </div>
                </div>
            </div>

            <div className='menu-addresses'>
                <button className="btn-addresses" onClick={() => setAddresses(!addresses)}>
                    <div className='btn-icon-menu'>
                        {
                            addresses ? 
                                <IoIosArrowDown className="btn-icon" />
                                :                                
                                <IoIosArrowUp className="btn-icon-up" />
                        }
                    </div>
                    <label style={{position: 'relative', top: '5px', cursor: 'pointer'}}>
                        Addresses
                    </label>
                </button>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                        addresses ?
                            allAddresses.map((item, idx) => {
                                return(
                                    <AddressesCard item={item} key={idx} />
                                )
                            })
                            : null
                    }   
                </div>
            </div>

        </div>
    )
}

export default Home