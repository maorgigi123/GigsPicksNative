import { USER_ACTION_TYPES } from "./user.types";

const INITIAL_STATE = {
    currentUser: null,
    messages : [],
    current_location: null,
    players_locations: [],
    LoadForPost: {cover:'',status:false}

}


export const userReducer = (state = INITIAL_STATE, action={}) => {
    const { type, payload } = action;
    switch(type)
    {
        case USER_ACTION_TYPES.SET_CURRENT_USER:
            return {
                ...state,
                currentUser:payload
            }
        case USER_ACTION_TYPES.SET_CURRENT_PROFILE_IMG:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    profile_img: payload
                }
             }

        case USER_ACTION_TYPES.SET_UPDTE_MESSAGE:
            const temp = state.messages.findIndex(conversation =>
                (conversation.participants[0].username === action.payload.sender.username && conversation.participants[1].username === action.payload.recipient.username) ||
                (conversation.participants[1].username === action.payload.sender.username && conversation.participants[0].username === action.payload.recipient.username)
            );
            if(temp > -1){
                return {
                    ...state,
                    messages: state.messages.map((conversation, index) => {
                        if (index === conversationIndex) {
                            // Update the `read` status of all messages in this conversation
                            const updatedMessages = conversation.messages.map(message => ({
                                ...message,
                                read: true // Set the read status to true for all messages
                            }));

                            // Add the new message to the updated messages
                            return {
                                ...conversation,
                                messages: [...updatedMessages, action.payload] // Append the new message
                            };
                        }
                        return conversation; // Keep other conversations unchanged
                    })
                }
            }
        case USER_ACTION_TYPES.SET_CURRENT_MESSAGES:
            return {
            ...state,
            messages : payload.slice().sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            })
            }

        case USER_ACTION_TYPES.SET_ADD_MESSAGE:
            console.log(payload.sender.username)
           // Find the index of the conversation that matches the participants
           const conversationIndex = state.messages.findIndex(conversation => 
            (conversation.participants[0].username === payload.sender.username && conversation.participants[1].username === payload.recipient.username) ||
            (conversation.participants[1].username === payload.sender.username && conversation.participants[0].username === payload.recipient.username)
        );
        if (conversationIndex > -1) {
            // If the conversation exists, update the messages array within it
            return {
                ...state,
                messages: state.messages.map((conversation, index) => {
                    if (index === conversationIndex) {
                        return {
                            ...conversation,
                            messages: [...conversation.messages, payload] // Add the new message
                        };
                    }
                    return conversation; // Keep other conversations unchanged
                })
            };
        } else {
            // If no matching conversation exists, create a new one
            const newConversation = {
               
                messages: [{...payload}], // Array of messages
                participants: [payload.sender, payload.recipient], // Array of participants
            }

            return {
                ...state,
                messages : [...state.messages, newConversation]
            };
        }

        case USER_ACTION_TYPES.SET_CURRENT_LOCATION:
            return {
                ...state,
                current_location:payload
            }

        case USER_ACTION_TYPES.SET_PLAYERS_LOCATION:
            const { username, location } = payload;
            // Update the existing location if the username matches
            const updatedLocations = state.players_locations.map(existingLocation =>
                existingLocation.username.username === username.username
                    ? { ...existingLocation, location } // Update location if username matches
                    : existingLocation
            );

            // Check if the username was found; if not, add the new location
            if (!updatedLocations.some(existingLocation => existingLocation.username.username === username.username)) {
                updatedLocations.push(payload);
            }

            return {
                ...state,
                players_locations: updatedLocations
            };
        case USER_ACTION_TYPES.SET_CURRENTPLAYERS:
            return {
                ...state,
                players_locations:payload
            }
        case USER_ACTION_TYPES.SET_LOAD_POST:
            return {
                ...state,
                LoadForPost:payload
            }

        default:
            return state;
    }
}
