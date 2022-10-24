import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';
import { Header, Button, Icon, Input, ListItem } from'react-native-elements';

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyB3JYFxpJCN4ZgpI4-vyoKQMFTAJKrUDXY",
    authDomain: "shoppinglist-e7466.firebaseapp.com",
    databaseURL: "https://shoppinglist-e7466-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shoppinglist-e7466",
    storageBucket: "shoppinglist-e7466.appspot.com",
    messagingSenderId: "900782144151",
    appId: "1:900782144151:web:b88f93eb91c186a0b787d2",
    measurementId: "G-W9970HJ8H7"
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  

  const saveItem = () => {
    if (product !== '' && amount !== '') {
      push(
        ref(database, 'shopping/'),
        {
          'product': product,
          'amount': amount
        }
      );
      setProduct('');
      setAmount('');
    } else {
      Alert.alert('Error', 'Please fill in the product and amount fields');
    }
  }

  const itemBought = (key) => {
    remove(ref(database, 'shopping/' + key));
  }

  useEffect(() => {
    const shoppingRef = ref(database, 'shopping/');
    onValue(shoppingRef, (snapshot) => {
      const data = snapshot.val();
      const shoppingItems = Object.keys(data).map((key) => ({
        key: key,
        product: data[key].product,
        amount: data[key].amount
      }));
      setShoppingList(shoppingItems);
    });
  }, []);

  return (
    
    <View style={styles.container}>

    <Header centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }} />

      <Input
        label='Product'
        placeholder='Product'
        onChangeText={value => setProduct(value)}
        value={product}
      />

      <Input
        label="Amount"
        placeholder='Amount'
        onChangeText={value => setAmount(value)}
        value={amount}
      />

      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', width: '75%' }}>
        <Button
            title="Save"
            onPress={saveItem}
            icon={{
              name: 'save',
              color: 'white'
            }}
            containerStyle={{
              width: '75%'
            }}
        />
      </View>

      <FlatList style={styles.flatList}
        data={shoppingList}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.product}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
            </ListItem.Content>
            <Button
              type='clear'
              onPress={() => itemBought(item.key)}
              icon={{
                name: 'delete',
                color: 'red'
              }}
              />
          </ListItem>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  flatList: {
    width: '100%',
  },
});
