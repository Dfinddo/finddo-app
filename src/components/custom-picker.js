import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Exemplo de uso
 * ```
 * <CustomPicker style={{height: 100, backgroundColor: 'white'}} items={[{ content: 'Teste' }]} />
 * ```
 */
export class CustomPicker extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    items: [],
    selectedItem: { content: 'Selecione um opção', value: null, id: 0 },
    isSelectingItem: false
  };

  componentDidMount() {
    let id = 0;
    const itemsArray = this.props.items
      .map((item) => {
        item.id = String(id);
        id++;
        return item;
      });

    this.setState({ items: itemsArray });
  }

  render() {
    return (
      <View style={this.props.style}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isSelectingItem && this.state.items.length > 0}
        >
          <View>

          </View>
        </Modal>
        <TouchableOpacity
          style={{
            flex: 1, flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between'
          }}>
          <Text style={{ marginLeft: 10 }}>{this.state.selectedItem.content}</Text>
          <Icon
            style={{ width: 35 }}
            name={'keyboard-arrow-down'}
            size={25} color='gray' />
        </TouchableOpacity>
      </View>
    );
  }
}
