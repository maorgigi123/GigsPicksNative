import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../store/user/user.action';
import Color from './Colors/Color';

const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        day: '',
        month: '',
        year: ''
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        day: '',
        month: '',
        year: '',
        date: ''
    });
    const [daysInMonth, setDaysInMonth] = useState([]);

    useEffect(() => {
        updateDaysInMonth(form.month, form.year);
    }, [form.month, form.year]);

    const updateDaysInMonth = (month, year) => {
        let days = 31;

        if (month) {
            const selectedMonth = parseInt(month);
            const selectedYear = parseInt(year);

            if (selectedMonth === 4 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 11) {
                days = 30;
            } else if (selectedMonth === 2) {
                if ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0)) {
                    days = 29;
                } else {
                    days = 28;
                }
            }
        }

        setDaysInMonth([...Array(days).keys()].map(i => `${i + 1}`));
    };

    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value,
        });

        if (name === 'month' || name === 'year') {
            updateDaysInMonth(name === 'month' ? value : form.month, name === 'year' ? value : form.year);
        }

        // Remove error when a valid value is entered
        if (value) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        if (form.firstName.length < 2) {
            validationErrors.firstName = 'First name must be at least 2 characters long.';
        }
        if (form.lastName.length < 2) {
            validationErrors.lastName = 'Last name must be at least 2 characters long.';
        }
        if (!form.email.includes('@')) {
            validationErrors.email = 'Please enter a valid email address.';
        }
        if (form.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long.';
        }
        if (form.password !== form.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!form.gender) {
            validationErrors.gender = 'Please select a gender.';
        }

        // Date validation
        if (!form.day) {
            validationErrors.day = 'Please select a day.';
        }
        if (!form.month) {
            validationErrors.month = 'Please select a month.';
        }
        if (!form.year) {
            validationErrors.year = 'Please select a year.';
        }
        if (!form.day || !form.month || !form.year) {
            validationErrors.date = 'Please select a valid date of birth.';
        }

        return validationErrors;
    };

    const handleRegister = () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
         console.log('fetch')
        } else {
            setErrors(validationErrors);
        }
    };

    const renderInput = (placeholder, name, secureTextEntry = false, keyboardType = 'default') => (
        <View style={styles.inputContainer}>
            <TextInput
                style={[
                    styles.input,
                    errors[name] && styles.inputError,  // Apply red border if error
                ]}
                placeholder={errors[name] ? `${placeholder} *` : placeholder}  // Add red * if error
                placeholderTextColor={errors[name] ? 'red' : '#BFBFBF'}  // Change * color to red
                value={form[name]}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onChangeText={(value) => handleChange(name, value)}
            />
        </View>
    );

    const currentYear = new Date().getFullYear();
    const years = [...Array(currentYear - 1899).keys()].map(i => `${currentYear - i}`);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Register</Text>

                {renderInput('First Name', 'firstName')}
                {renderInput('Last Name', 'lastName')}
                {renderInput('Email', 'email', false, 'email-address')}
                {renderInput('Password', 'password', true)}
                {renderInput('Confirm Password', 'confirmPassword', true)}

                <View style={styles.inputContainer}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Select Gender',
                            value: ''
                        }}
                        onValueChange={(value) => handleChange('gender', value)}
                        items={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' },
                        ]}
                        style={{
                            inputIOS: [
                                styles.input,
                                errors.gender && styles.inputError,
                            ],
                            inputAndroid: [
                                styles.input,
                                errors.gender && styles.inputError,
                            ]
                        }}
                        value={form.gender}
                        onOpen={() => {
                            setErrors({
                                ...errors,
                                gender: '',  // Clear the error when the picker is opened
                            });
                        }}
                    />
                    {errors.gender && <Text style={styles.errorText}>*</Text>}
                </View>

                <View style={styles.dateContainer}>
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            placeholder={{ label: 'Day', value: '' }}
                            onValueChange={(value) => handleChange('day', value)}
                            items={daysInMonth.map(day => ({ label: day, value: day }))}
                            style={pickerSelectStyles(errors.day || errors.date)}
                            value={form.day}
                        />
                        {errors.day && <Text style={styles.errorText}>*</Text>}
                    </View>
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            placeholder={{ label: 'Month', value: '' }}
                            onValueChange={(value) => handleChange('month', value)}
                            items={[...Array(12).keys()].map(i => ({ label: `${i + 1}`, value: `${i + 1}` }))}
                            style={pickerSelectStyles(errors.month || errors.date)}
                            value={form.month}
                        />
                        {errors.month && <Text style={styles.errorText}>*</Text>}
                    </View>
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            placeholder={{ label: 'Year', value: '' }}
                            onValueChange={(value) => handleChange('year', value)}
                            items={years.map(year => ({ label: year, value: year }))}
                            style={pickerSelectStyles(errors.year || errors.date)}
                            value={form.year}
                        />
                        {errors.year && <Text style={styles.errorText}>*</Text>}
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.BLACK,
    },
    innerContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Color.WHITE,
        marginBottom: 20,
        textAlign:'center'
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 16,
        color: Color.WHITE,
        backgroundColor: Color.BLACK,
    },
    inputError: {
        borderColor: 'red',
    },
    button: {
        height: 50,
        backgroundColor: Color.PRIMARY_BUTTON,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        color: Color.PRIMARY_BUTTON,
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    pickerWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
    errorText: {
        color: 'red',
        position: 'absolute',
        right: 10,
        top: 10,
    },
});

const pickerSelectStyles = (hasError) => StyleSheet.create({
    inputIOS: {
        height: 50,
        borderColor: hasError ? 'red' : '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 16,
        color: Color.WHITE,
        backgroundColor: Color.BLACK,
    },
    inputAndroid: {
        height: 50,
        borderColor: hasError ? 'red' : '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 16,
        color: Color.WHITE,
        backgroundColor: Color.BLACK,
    },
});

export default RegisterScreen;
