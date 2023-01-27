import { createSlice } from '@reduxjs/toolkit'

export const headerSlice = createSlice({
    name: 'header',
    initialState: {
        pageTitle: "Home",  // current page title state management
        noOfNotifications : 15,  // no of unread notifications
        newNotificationMessage : "",  // message of notification to be shown
        newNotificationStatus : 1,   // to check the notification type -  success/ error/ info
        userBalance: 0,
        allPleitos: [],
        sindicoAddress: '0x0000000000000000000000000000000000000000',
        amountOfPleitos: 'loading',
    },
    reducers: {
        setPageTitle: (state, action) => {
            state.pageTitle = action.payload.title
        },

        removeNotificationMessage: (state, action) => {
            state.newNotificationMessage = ""
        },

        showNotification: (state, action) => {
            state.newNotificationMessage = action.payload.message
            state.newNotificationStatus = action.payload.status
        },

        setUserBalance: (state, action) => {
            state.userBalance = action.payload
        },

        setAllPleitos: (state, action) => {
            state.allPleitos = action.payload
        },

        setSindico: (state, action) => {
            state.sindicoAddress = action.payload
        },

        setAmountOfPleitos: (state, action) => {
            state.amountOfPleitos = action.payload
        }
    }
})

export const { setPageTitle, removeNotificationMessage, showNotification, setUserBalance, setAllPleitos, setSindico, setAmountOfPleitos } = headerSlice.actions

export default headerSlice.reducer