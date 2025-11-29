import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { Ionicons } from "@expo/vector-icons";

import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabsLayout = () => {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) return <Redirect href={"/(auth)/sign-In"} />;

    return < Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                borderTopWidth: 1,
                paddingBottom: 8,
                paddingTop: 8,
                height: 80,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
            },
        }}
            
            
        >
        <Tabs.Screen
            name="index"
            options={{
                title: "",
                tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={30} />,
            }}
        />

        <Tabs.Screen
            name="userScreen"
            options={{
                title: "",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="user" size={30} color={color} />
                ),
            }}
        />
    </Tabs >
};

export default TabsLayout;