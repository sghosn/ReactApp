import { USER_STATE_CHANGE } from "../constants"
import { USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USER_NOTIFICATION_STATE_CHANGE, CLEAR_DATA } from "../constants"


const initialState = {
    currentUser: null,
    posts: [],
    following: [],
    notifications: []
}

export const user = (state = initialState, action) => {
    switch(action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case USER_NOTIFICATION_STATE_CHANGE:
            return {
                ...state,
                notifications: action.notifications
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }

}