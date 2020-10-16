import {
  addInnerText,
  setStyleToElement,
  setBackgroundImage,
  removeChildElement,
  createReplySvgIcon,
  removeClassFromElement,
  removeStyleFromElement,
  removeClassFromAllDocument,
} from './dom-utility'

import { setState, getState } from '../index'

// Chat page main Id and class namess
const chatPageId = 'chat-page'
const chatSectionId = 'chat-section'
const activeClassName = 'active-profile'
const startMessagingId = 'start-messaging'
const chatListWrapper = document.getElementById('chat-list')

// Chat section main Id and class names
// profile
const profileNameId = 'profile-name'
const profileAboutId = 'profile-about'
const profileAvatarId = 'profile-avatar'
const profileHeaderId = 'profile-header'

// Chat messages
const messageListsId = 'message-lists'
const messageListWrapper = document.getElementById(messageListsId)

// Modal
const modalContentId = 'modal-content'

function handleActiveChatPage(chatItem) {
  removeClassFromAllDocument(activeClassName)
  chatItem.classList.add(activeClassName)
  removeStyleFromElement(chatSectionId, 'display')
  removeClassFromElement(chatPageId, 'center-layout')
  setStyleToElement(startMessagingId, 'display', 'none')
}

function setHeaderProfile(avatar, name, about) {
  addInnerText(profileNameId, name)
  addInnerText(profileAboutId, about)
  setBackgroundImage(profileAvatarId, avatar)
}

function setMessages(id, avatar, userProfile) {
  const contacts = getState('contacts')
  const getLastMessages = contacts.filter((chat) => chat.id === id)[0].chats

  removeChildElement(messageListsId)

  getLastMessages.forEach((messageItem) => {
    let avatarImage = ''

    const messageElement = document.createElement('li')
    messageElement.classList.add('chat-page__message')

    const AvatarElement = document.createElement('span')
    const chatTextsWrapper = document.createElement('div')
    const chatText = document.createElement('span')

    chatTextsWrapper.classList.add('chat-page__texts')
    chatText.classList.add('chat-page__text')

    if (messageItem.isFromFriend) {
      avatarImage = avatar
      chatText.classList.add('chat-page__text--freind')
      chatTextsWrapper.classList.add('chat-page__texts--freind')
    } else {
      avatarImage = userProfile.avatar
    }

    AvatarElement.style.backgroundImage = `url('${avatarImage}')`
    AvatarElement.classList.add('profile__avatar', 'profile__avatar--small')

    chatText.innerText = messageItem.message
    chatTextsWrapper.appendChild(chatText)

    const replySvgIcon = createReplySvgIcon()

    messageElement.appendChild(AvatarElement)
    messageElement.appendChild(chatTextsWrapper)
    messageElement.appendChild(replySvgIcon)
    messageListWrapper.appendChild(messageElement)
  })
}

export function renderChatList() {
  const contacts = getState('contacts')
  const userProfile = getState('userProfile')

  contacts.forEach((chat) => {
    const { avatar, name, chats, about, id } = chat

    let chatItem = document.createElement('li')
    chatItem.classList.add('chat-listــitem', 'profile', 'profile-area-padding')

    let avatarElement = document.createElement('span')
    avatarElement.classList.add('profile__avatar')
    avatarElement.style.backgroundImage = `url('${avatar}')`

    let infoWrapper = document.createElement('div')
    infoWrapper.classList.add('profile__info')

    let profileName = document.createElement('span')
    profileName.classList.add('profile__name')
    profileName.innerText = name

    let profileLastMessage = document.createElement('span')
    profileLastMessage.classList.add('profile__last-message')

    const lastProfileMessage = chats[chats.length - 1].message
    profileLastMessage.innerText = lastProfileMessage

    infoWrapper.appendChild(profileName)
    infoWrapper.appendChild(profileLastMessage)

    chatItem.appendChild(avatarElement)
    chatItem.appendChild(infoWrapper)

    chatItem.addEventListener('click', () => {
      handleActiveChatPage(chatItem)
      setHeaderProfile(avatar, name, about)
      setMessages(id, avatar, userProfile)
      setState('activeChat', chat)
    })

    chatListWrapper.appendChild(chatItem)
  })
}

export function renderNewMessage(message, userProfile) {
  const messageElement = document.createElement('li')
  messageElement.classList.add('chat-page__message')

  const AvatarElement = document.createElement('span')
  const chatTextsWrapper = document.createElement('div')
  const chatText = document.createElement('span')

  chatTextsWrapper.classList.add('chat-page__texts')
  chatText.classList.add('chat-page__text')

  AvatarElement.style.backgroundImage = `url('${userProfile.avatar}')`
  AvatarElement.classList.add('profile__avatar', 'profile__avatar--small')

  chatText.innerText = message
  chatTextsWrapper.appendChild(chatText)

  const replySvgIcon = createReplySvgIcon()
  replySvgIcon.classList.add('delay-reply')

  messageElement.appendChild(AvatarElement)
  messageElement.appendChild(chatTextsWrapper)
  messageElement.appendChild(replySvgIcon)
  messageListWrapper.appendChild(messageElement)
}

export function renderModalHeaderProfile() {
  const headerProfile = document.getElementById(profileHeaderId)
  const modalContent = document.getElementById(modalContentId)

  headerProfile.addEventListener('click', () => {
    const activeUserChat = getState('activeChat')

    let profileWrapper = document.createElement('div')
    profileWrapper.classList.add('profile-about', 'profile')

    const avatarElement = document.createElement('span')
    avatarElement.style.backgroundImage = `url('${activeUserChat.avatar}')`
    avatarElement.classList.add('profile__avatar', 'center-img')

    const aboutElement = document.createElement('span')
    aboutElement.innerText = `About: ${activeUserChat.about}`

    const userNameElement = document.createElement('span')
    userNameElement.innerText = `User name: ${activeUserChat.userName}`

    const userTellElement = document.createElement('span')
    userTellElement.innerText = `Tell: ${activeUserChat.tell}`

    profileWrapper.appendChild(avatarElement)
    profileWrapper.appendChild(aboutElement)
    profileWrapper.appendChild(userNameElement)
    profileWrapper.appendChild(userTellElement)
    modalContent.innerHTML = null
    modalContent.appendChild(profileWrapper)
  })
}
