import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import styles from './styles';

import logoImg from '../../assets/logo.png';
import api from '../../services/api';

export default function Incidents() {
    const navigation = useNavigation();
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }


    const loadIncidents = async () => {
        if (loading) {
            return;
        }

        if (total > 0 && incidents.length === total) {
            return;
        }

        setLoading(true);

        const response = await api.get('incidents/available', {
            params: { page }
        });

        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setLoading(false);
        setPage(page + 1);
    };

    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg}></Image>
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>
                Bem-Vindo!
            </Text>
            <Text style={styles.description}>
                Escolha um dos casos abaixo e salve o dia.
            </Text>

            <FlatList
                style={styles.incidentList}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.5}
                renderItem={({ item: incident }) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>
                            ONG:
                        </Text>
                        <Text style={styles.incidentProperty}>
                            {incident.name}
                        </Text>

                        <Text style={styles.incidentProperty}>
                            CASO:
                        </Text>
                        <Text style={styles.incidentProperty}>
                            {incident.title}
                        </Text>

                        <Text style={styles.incidentProperty}>
                            VALOR:
                        </Text>
                        <Text style={styles.incidentProperty}>
                            {
                                Intl.NumberFormat(
                                    'pt-BR',
                                    {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }
                                ).format(incident.value)
                            }
                        </Text>

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>
                                Ver mais detalhes
                                </Text>
                            <Feather name="arrow-right" size={16} color='#e02041'></Feather>
                        </TouchableOpacity>
                    </View>
                )}>

            </FlatList>
        </View>
    );
}