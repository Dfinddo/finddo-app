import React, { Component } from 'react';
import {
  View, TouchableOpacity,
  Text, Modal,
  StyleSheet,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../colors';

/**
 * Objetos para o array precisam ter `content`, `value` e `id`,
 * ambos com o tipo `String`, `id` precisa ser único
 * 
 * Exemplo de uso
 * ```
 * const items = [{ content: 'teste', value: 'teste', id: '0' }];
 * 
 * const onSelect = (item) => console.log(item);
 * 
 * <CustomPicker 
 *   style={{height: 100, backgroundColor: 'white'}} 
 *   items={items} defaultItem={items[0]}
 *   onSelect={onSelect} />
 * ```
 */
export class CustomPicker extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    items: [],
    selectedItem: { content: 'Selecione uma opção', value: null, id: 0 },
    isSelectingItem: false
  };

  componentDidMount() {
    this.setState({ items: this.props.items }, () => {
      if (this.props.defaultItem) {
        this.setState({ selectedItem: this.props.defaultItem });
      } else {
        this.setState({ selectedItem: this.state.items[0] });
      }
    });
  }

  onItemSelected = (selectedItem) => {
    this.setState({ isSelectingItem: false, selectedItem }, () => {
      this.props.onSelect(selectedItem);
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isSelectingItem && this.state.items.length > 0}
        >
          <View style={[
            customPickerStyles.modalSelecaoContainer,
            customPickerStyles.centralizar]}>
            <FlatList
              style={customPickerStyles.listaDeItems}
              data={this.state.items}
              renderItem={({ item }) => (
                <Item
                  id={item.id}
                  item={item}
                  onPress={this.onItemSelected}
                />
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </Modal>
        <TouchableOpacity
          style={customPickerStyles.botaoPrincipalSelectContainer}
          onPress={() => this.setState({ isSelectingItem: true })}>

          <Text style={customPickerStyles.rotuloSelecionado}>
            {this.state.selectedItem.content}
          </Text>
          <Icon
            style={customPickerStyles.setaDropdown}
            name={'keyboard-arrow-down'}
            size={25} color={colors.cinza} />

        </TouchableOpacity>
      </View>
    );
  }
}

const customPickerStyles = StyleSheet.create({
  centralizar: { alignItems: 'center', justifyContent: 'center' },
  botaoPrincipalSelectContainer: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between'
  },
  rotuloSelecionado: { marginLeft: 10, fontSize: 18 },
  setaDropdown: { width: 35 },
  modalSelecaoContainer: {
    flex: 1, backgroundColor: colors.transparenciaModais,
  },
  itemSelecionavelContainer: {
    width: 320, height: 50,
    backgroundColor: colors.branco, marginVertical: 10
  },
  listaDeItems: { marginVertical: 20, flex: 1 }
});

export default function Item(props) {
  return (
    <TouchableOpacity style={[
      customPickerStyles.itemSelecionavelContainer,
      customPickerStyles.centralizar]}
      onPress={() => props.onPress(props.item)}>
      <Text style={{ fontSize: 18 }}>{props.item.content}</Text>
    </TouchableOpacity>
  );
}