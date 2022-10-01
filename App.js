import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

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

      <TextInput
        style={styles.textInputStyle}
        placeholder='Product'
        onChangeText={value => setProduct(value)}
        value={product}
      />

      <TextInput
        style={styles.textInputStyle}
        placeholder='Amount'
        onChangeText={value => setAmount(value)}
        value={amount}
      />

      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', width: '75%' }}>
        <Button
            style={styles.buttonStyle}
            title="Save"
            onPress={saveItem}
        />
      </View>
      

      <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', margin: 20 }}>
        <Text style= {{ color: 'blue', fontSize: 16, fontWeight: 'bold' }} >Shopping List</Text>
        <FlatList
            data={shoppingList}
            renderItem={({item}) =>
              <View style={styles.listContainer}>
                <Text>{item.product}, {item.amount}</Text>
                <Text style={{color: '#0000ff'}} onPress={() => itemBought(item.key)}> Delete</Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
        />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonStyle: {
    width: 10,
    height: 10,
    margin: 20,
    alignContent: 'center',
  },
  textInputStyle: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin:10
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
