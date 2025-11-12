import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


export const useForm = () => {

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
    });

    const { reset, control, trigger, handleSubmit } = methods;

    return {
        trigger,
        handleSubmit,
    };

}