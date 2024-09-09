// import { Tabs } from 'expo-router';
// import React from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="test"
//         options={{
//           title: 'Tests',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import { ActivityIndicator, View, Alert } from 'react-native';
// import { Tabs } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const [designation, setDesignation] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserDesignation = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (user) {
//           const firestore = getFirestore();
//           const usersRef = collection(firestore, 'Users');
//           const q = query(usersRef, where('email', '==', user.email)); // Assuming the 'Users' collection has an 'email' field
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             querySnapshot.forEach((doc) => {
//               const userData = doc.data();
//               console.log('User Data:', userData.designation); // Log user data for debugging

//               if (userData?.designation) {
//                 setDesignation(userData.designation); // Set designation if found
//               } else {
//                 Alert.alert('Error', 'No designation found for this user.');
//               }
//             });
//           } else {
//             Alert.alert('Error', 'No such user found in the Users collection.');
//           }
//         } else {
//           Alert.alert('Error', 'User is not authenticated.');
//         }
//       } catch (error) {
//         console.error('Error fetching user designation:', error);
//         Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDesignation();
//   }, []);

//   // Display loading spinner while fetching data
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
//       </View>
//     );
//   }

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
//           ),
//         }}
//       />
//       {designation === 'Engineer' && (
//         <Tabs.Screen
//           name="explore"
//           options={{
//             title: 'Explore',
//           }}
//         />
//       )}
//       {designation === 'Supervisor' && (
//         <Tabs.Screen
//           name="test"
//           options={{
//             title: 'Tests',
//           }}
//         />
//       )}
//     </Tabs>
//   );
// }



// Below is u know:

// import React, { useState, useEffect } from 'react';
// import { ActivityIndicator, View, Alert } from 'react-native';
// import { Tabs } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const [designation, setDesignation] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserDesignation = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (user) {
//           const firestore = getFirestore();
//           const usersRef = collection(firestore, 'Users');
//           const q = query(usersRef, where('email', '==', user.email)); // Assuming the 'Users' collection has an 'email' field
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             querySnapshot.forEach((doc) => {
//               const userData = doc.data();
//               console.log('User Data:', userData.designation); // Log user data for debugging

//               if (userData?.designation) {
//                 setDesignation(userData.designation); // Set designation if found
//               } else {
//                 Alert.alert('Error', 'No designation found for this user.');
//               }
//             });
//           } else {
//             Alert.alert('Error', 'No such user found in the Users collection.');
//           }
//         } else {
//           Alert.alert('Error', 'User is not authenticated.');
//         }
//       } catch (error) {
//         console.error('Error fetching user designation:', error);
//         Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDesignation();
//   }, []);

//   // Display loading spinner while fetching data
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
//       </View>
//     );
//   }

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//       }}
//     >
//       {/* Home Screen always shown */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
//           ),
//         }}
//       />

//       {/* Only show "Explore" tab for Engineers */}
//       {designation === 'Engineer' && (
//         <Tabs.Screen
//           name="explore"
//           options={{
//             title: 'Explore',
//             tabBarIcon: ({ color, focused }) => (
//               <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
//             ),
//           }}
//         />
//       )}

//       {/* Only show "Tests" tab for Supervisors */}
//       {designation === 'Supervisor' && (
//         <Tabs.Screen
//           name="test"
//           redirect={true}
//           options={{
//             title: 'Tests',
//             tabBarIcon: ({ color, focused }) => (
//               <TabBarIcon name={focused ? 'flask' : 'flask-outline'} color={color} />
//             ),
//           }}
//         />
//       )}

//       {/* Add other designation-specific screens here if needed */}
//     </Tabs>
//   );
// }

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { Tabs } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [designation, setDesignation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDesignation = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const firestore = getFirestore();
          const usersRef = collection(firestore, 'Users');
          const q = query(usersRef, where('email', '==', user.email)); // Assuming the 'Users' collection has an 'email' field
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              //console.log('User Data:', userData.designation); // Log user data for debugging

              if (userData?.designation) {
                setDesignation(userData.designation); // Set designation if found
                 console.log(designation)
              } else {
                Alert.alert('Error', 'No designation found for this user.');
              }
            });
          } else {
            Alert.alert('Error', 'No such user found in the Users collection.');
          }
        } else {
          Alert.alert('Error', 'User is not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching user designation:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDesignation();
  }, []);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      {/* Home Screen always shown */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      {/* Show "Explore" tab only for Engineer, hide if designation does not match */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
          ),
          href: designation === 'Engineer' ? undefined : null, // Hide tab if not Engineer
        }}
      />

      {/* Show "Tests" tab only for Supervisor, hide if designation does not match */}
      <Tabs.Screen
        name="test"
        options={{
          title: 'Tests',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'flask' : 'flask-outline'} color={color} />
          ),
          href: designation === 'Supervisor' ? undefined : null, // Hide tab if not Supervisor
        }}
      />
    </Tabs>
  );
}
