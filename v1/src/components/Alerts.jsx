import React from 'react'
import { useState, useEffect } from 'react'
import Alert from 'react-popup-alert'

const Alerts = ({katilimciSayisiError,onShowAlert}) => {


    const [alert, setAlert] = useState({
        type: 'error',
        text: katilimciSayisiError,
        show: false
    })

    function onCloseAlert() {
        setAlert({
            type: '',
            text: '',
            show: false
        })
    }

    // function onShowAlert(type) {
    //     setAlert({
    //         type: type,
    //         text: 'Demo alert',
    //         show: true
    //     })
    // }


    return (

        <div>
            {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                <button onClick={() => onCloseAlert()}>Hide alert</button>
                <button onClick={() => onShowAlert('success')}>
                    Show success alert
                </button>
                <button onClick={() => onShowAlert('error')}>Show error alert</button>
                <button onClick={() => onShowAlert('warning')}>
                    Show warning alert
                </button>
            </div> */}
            <Alert
                header={'Header'}
                btnText={'Close'}
                text={alert.text}
                type={alert.type}
                show={alert.show}
                onClosePress={onCloseAlert}
                pressCloseOnOutsideClick={true}
                showBorderBottom={true}
                alertStyles={{}}
                headerStyles={{}}
                textStyles={{}}
                buttonStyles={{}}
            />
        </div>

    )
}

export default Alerts