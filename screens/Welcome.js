import { View, Text, Pressable, Image, Dimensions } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {
    const screenHeight = Dimensions.get('window').height;

    return (
        <LinearGradient
            style={{
                flex: 1,
            }}
            colors={[COLORS.black, COLORS.black]}
        >
            <View style={{ flex: 1 }}>
                <View>
                    <Image
                        source={require("../assets/5.jpg")}
                        style={{
                            height: screenHeight * 0.1,
                            width: screenHeight * 0.1,
                            borderRadius: 20,
                            position: "absolute",
                            top: screenHeight * 0.02,
                            left: screenHeight * 0.02,
                            transform: [
                                { rotate: "-15deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/2.jpg")}
                        style={{
                            height: screenHeight * 0.1,
                            width: screenHeight * 0.1,
                            borderRadius: 20,
                            position: "absolute",
                            top: screenHeight * -0.03,
                            left: screenHeight * 0.25,
                            transform: [
                                { rotate: "-5deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/3.jpg")}
                        style={{
                            height: screenHeight * 0.1,
                            width: screenHeight * 0.1,
                            borderRadius: 20,
                            position: "absolute",
                            top: screenHeight * 0.13,
                            left: screenHeight * -0.13,
                            transform: [
                                { rotate: "15deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/3.jpg")}
                        style={{
                            height: screenHeight * 0.2,
                            width: screenHeight * 0.2,
                            borderRadius: 20,
                            position: "absolute",
                            top: screenHeight * 0.11,
                            left: screenHeight * 0.25,
                            transform: [
                                { rotate: "-15deg" }
                            ]
                        }}
                    />
                </View>

                {/* content  */}

                <View style={{
                    paddingHorizontal: 22,
                    position: "absolute",
                    top: screenHeight * 0.4,
                    width: "100%"
                }}>
                    <Text style={{
                        fontSize: 0.06 * screenHeight,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>Explore</Text>
                    <Text style={{
                        fontSize: 0.055 * screenHeight,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>Coffee World</Text>
                    <View style={{ marginVertical: 0.02 * screenHeight }}>
                        <Text style={{
                            fontSize: 0.016 * screenHeight,
                            color: COLORS.white,
                            marginVertical: 0.004 * screenHeight
                        }}>Discover the finest coffee blends</Text>
                        <Text style={{
                            fontSize: 0.016 * screenHeight,
                            color: COLORS.white,
                        }}>Join us for a flavorful experience</Text>
                    </View>
                    <Button
                        title="Join Now"
                        onPress={() => navigation.navigate("Signup")}
                        style={{
                            marginTop: 0.022 * screenHeight,
                            width: "100%"
                        }}
                    />
                    <View style={{
                        flexDirection: "row",
                        marginTop: 0.012 * screenHeight,
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            fontSize: 0.016 * screenHeight,
                            color: COLORS.white
                        }}>Already have an account ?</Text>
                        <Pressable
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={{
                                fontSize: 0.016 * screenHeight,
                                color: COLORS.white,
                                fontWeight: "bold",
                                marginLeft: 0.004 * screenHeight
                            }}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

export default Welcome
