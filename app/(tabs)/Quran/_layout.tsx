import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
   <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name='index'/>
    <Stack.Screen name='Listen'/>
    <Stack.Screen name='Read'/>

   </Stack>
  )
}

export default _layout