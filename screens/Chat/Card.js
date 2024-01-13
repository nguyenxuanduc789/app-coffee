import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { WebView } from "react-native-webview";

export default class Cardone extends React.Component {
  state = {
    showModal: false,
    status: "Pending"
  };

  handleResponse = data => {
    if (data.title === "success") {
      this.setState({ showModal: false, status: "Complete" });
    } else if (data.title === "cancel") {
      this.setState({ showModal: false, status: "Cancelled" });
    } else {
      return;
    }
  };

  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
        >
          <WebView
            source={{ uri: "http://192.168.1.12:3000/" }}
            onNavigationStateChange={data => this.handleResponse(data)}
            injectedJavaScript={`document.f1.submit()`} // You may need to adjust this line based on your use case
          />
        </Modal>
        <TouchableOpacity
          style={{ width: 300, height: 100 }}
          onPress={() => this.setState({ showModal: true })}
        >
          <Text>Pay with Paypal</Text>
        </TouchableOpacity>
        <Text>Payment Status: {this.state.status}</Text>
      </View>
    );
  }
}
