import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserContext } from "./contexts/User";
import {
  getDatabase,
  set,
  ref,
  push,
  remove,
  onValue,
  DataSnapshot,
} from "firebase/database";
const MedicalHistory = () => {
  const [newInput, setNewInput] = useState("");
  const [list, setList] = useState([]);
  const { userId } = useContext(UserContext);
  const handleSubmit = (newInput) => {
    setList((currentList) => {
      return [...currentList, newInput];
    });
    setNewInput("");
  };
  const handleRemove = (item) => {
    const removedItemArray = list.filter((e) => e !== item);
    setList(removedItemArray);
  };

  const updateData = (userId, diagnosis) => {
    const db = getDatabase();
    const reference = ref(db, `users/${userId}/diagnosis`);
    const newUpdate = push(reference);
    remove(reference);
    set(newUpdate, { diagnosis: diagnosis });
  };
  {
    console.log(userId);
  }

  // const renderData = () => {
  //   const db = getDatabase().DataSnapshot;
  //   const data = ref(db, `users/${userId}/diagnosis`);
  //   const key = getKey(data);
  //   console.log(db);
  // };

  // const readData = (userId) => {
  //   const db = getDatabase();
  //   const readReference = ref(db, `users/${userId}/diagnosis/diagnosis`);
  //   onValue(readReference, (snapshot) => {
  //     const data = snapshot.val();
  //     updateList(postElement, data);
  //   });
  // };
  // readData(userId);

  //   const readData = (userId) => {
  //     const db = getDatabase();
  //     const dataReference = ref(db, `users/${userId}/diagnosis/diagnosis`);

  //     onValue(dataReference, (DataSnapshot) => {
  //       console.log(DataSnapshot.val().ref._path.pieces);
  //     });
  //   };
  //   const readData = (userId) => {
  //     const db = getDatabase();
  //     const ref = db.ref(`users/${userId}`);
  //     ref.orderByKey().on("diagnosis", (snapshot) => {
  //       console.log(snapshot.key);
  //     });
  //   };

  const readDatabase = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val().diagnosis);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical History</Text>
      <TextInput
        style={styles.input}
        placeholder="Add to your medical history..."
        onChangeText={(value) => {
          setNewInput(value);
        }}
        value={newInput}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleSubmit(newInput)}
      >
        <Text style={styles.add}>Add</Text>
      </TouchableOpacity>
      {console.log(list)}
      <Text style={styles.yourHistory}>Your medical history</Text>
      <FlatList
        style={styles.flatlist}
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemBox}>
            <Text style={styles.item}>{item}</Text>
            <Text
              style={styles.removeButton}
              onPress={() => handleRemove(item)}
            >
              Remove
            </Text>
          </TouchableOpacity>
        )}
      ></FlatList>
      <TouchableOpacity onPress={() => updateData(userId, list)}>
        Save
      </TouchableOpacity>
      <TouchableOpacity onPress={() => readDatabase()}>
        seeData
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderColor: "#000000",
    borderWidth: 3,
    marginTop: 40,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10,
    paddingLeft: 20,
  },
  title: {
    fontSize: 30,
    textAlignVertical: "top",
    marginTop: 100,
    textAlign: "left",
    marginLeft: 20,
  },
  addButton: {
    backgroundColor: "#ADD8E6",
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 20,
    width: 100,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 40,
  },
  yourHistory: {
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
  },
  boxList: {
    backgroundColor: "#ADD8E6",
    margin: 20,
    borderColor: "#000000",
    borderWidth: 1,
  },
  add: {
    fontSize: 15,
  },
  removeButton: {
    borderColor: "#000000",
    borderWidth: 2,
    margin: 10,
    borderRadius: 15,
    paddingTop: 5,
    paddingBottom: 5,
    width: 70,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 40,
    textAlign: "center",
    verticalAlign: "center",
  },
  flatlist: {
    backgroundColor: "#ADD8E6",
    marginTop: 10,
    borderColor: "#000000",
    borderWidth: 1,
    margin: 10,
  },
  item: {
    paddingLeft: 20,
    paddingTop: 10,
    textAligne: "center",
  },
  itemBox: {
    borderBottomColor: "#000000",
    borderWidth: 0.5,
    alignContent: "center",
  },
});
export default MedicalHistory;
