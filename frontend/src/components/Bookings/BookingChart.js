import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './BookingChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);


const BOOKINGS_BUCKET = {
    'CHEAP': {
        min: 0,
        max: 19
    },
    'NORMAL': {
        min: 20,
        max: 39
    },
    'EXPENSIVE': {
        min: 40,
        max: 100000
    }
}

export default function BookingChart(props) {
    const chartData = { labels: [], datasets: [] };
    let values = [];

    for (const bucket in BOOKINGS_BUCKET) {
        const filterBookingsCounter = props.bookings.reduce((prev, current) => {
            if (current.event.price >= BOOKINGS_BUCKET[bucket].min && current.event.price <= BOOKINGS_BUCKET[bucket].max) {
                return prev + 1;
            }
            return prev;
        }, 0);
        values.push(filterBookingsCounter);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            label: bucket,
            data: values,
            backgroundColor: '#31348e',
            borderColor: 'black'
        });
        values = [...values];
        values[values.length - 1] = 0
    }

    return (
        <div><Bar className="barChart" data={chartData} /></div>
    )
}
