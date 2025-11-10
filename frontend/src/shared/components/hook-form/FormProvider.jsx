import { FormProvider as Form } from 'react-hook-form';

export default function FormProvider({ children, onSubmit, methods }) {
  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit}>{children} </form>
    </Form>
  );
}
