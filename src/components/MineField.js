import React from 'react';
import { View, StyleSheet } from 'react-native';
import Field from './Field';

export default props => {
    const rows = props.board.map((row, r)=> {
        const columns = row.map((field, c) => { // o parametro passado field(objeto) vai pegar os objetos passado em functions.js
            return <Field {...field} key={c} // importante sempre que retornar um array de arquivo JSX colocar key.
               onOpen={() => props.onOpenField(r, c)} 
               onSelect={e => props.onSelectField(r, c)} /> 
        })
        return <View key={r}
            style={{flexDirection: 'row'}}>{columns}</View>
    })
    return <View style={styles.container}>{rows}</View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
    }
})