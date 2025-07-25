import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import IActivity from "@/interfaces/IActivity";
import colors from "../../constants/Colors";

interface ActivityCardProps {
    item: IActivity;
    showInscrever?: boolean;
    onInscrever?: () => void;
    inscrito?: boolean;
}

export default function ActivityCard({ item, showInscrever, onInscrever, inscrito }: ActivityCardProps) {
    function formatarData(data: string) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR");
    }

    return (
        <View style={styles.atividadeItem}>
            <View style={styles.atividadeInfo}>
                <Text style={styles.atividadeNome}>{item.titulo}</Text>
                <Text style={styles.atividadeDetail}>
                    <Text style={styles.bold}>Esporte: </Text>
                    {item.sportId}
                </Text>
                <Text style={styles.atividadeDetail}>
                    <Text style={styles.bold}>Local: </Text>
                    {item.placeId}
                </Text>
                <Text style={styles.atividadeDetail}>
                    <Text style={styles.bold}>Data: </Text>
                    {formatarData(item.dataAtividade)}
                </Text>
                <Text style={styles.atividadeDetail}>
                    <Text style={styles.bold}>Horário: </Text>
                    {item.atividadeStartTime} às {item.atividadeFinishTime}
                </Text>
            </View>

            {showInscrever && onInscrever && (
                <TouchableOpacity
                    style={[styles.btnInscrever, inscrito && styles.btnCancelar]}
                    onPress={onInscrever}
                >
                    <Text style={styles.btnInscreverText}>
                        {inscrito ? "Desinscrever" : "Inscrever"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    atividadeItem: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        elevation: 1,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        flexDirection: "row",
        alignItems: "center",
    },
    atividadeInfo: {
        flex: 1,
    },
    atividadeNome: {
        fontWeight: "bold",
        fontSize: 18,
        color: colors.textPrimary,
        marginBottom: 6,
    },
    atividadeDetail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    bold: {
        fontWeight: "bold",
    },

    btnInscrever: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignSelf: "center",
    },
    btnInscreverText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    btnCancelar: {
        backgroundColor: "#d32f2f",
    },

});
