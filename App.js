import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from'expo-sqlite';

export default function App() {
  const [product, setProduct] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [shoppingList, setShoppingList] = React.useState([]);
  const db = SQLite.openDatabase('assignments.db');

  const saveItem = () => {
    if (product !== '' && amount !== '') {
      db.transaction(tx => {
        tx.executeSql('insert into shopping (product, amount) values (?, ?);', [product, amount]);
      }, () => console.log('Impossible to save the product'), () => {
        updateList();
        setProduct('');
        setAmount('');
      });
    } else {
      Alert.alert('Error', 'Please fill in the product and amount fields');
    }
  }

  const itemBought = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from shopping where id = ?;', [id]);
    }, () => console.log('An error has occurred when we deleted the item'), updateList);
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping;', [], (_, {rows}) => setShoppingList(rows._array));
    }, () => console.log('An error has occurred when we selected all the data'), null);
  }

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, product text, amount text);');
    }, () => console.log('Impossible to create or access to the specified table'), updateList);
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
                <Text style={{color: '#0000ff'}} onPress={() => itemBought(item.id)}> Bought</Text>
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
