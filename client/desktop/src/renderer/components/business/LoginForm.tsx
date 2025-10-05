import { Button, Form, Input } from "../ui";

export const LoginForm = () => {
  return (
    <Form title="Вход">
      <Input placeholder="Логин" />
      <Input type="password" placeholder="Пароль" />
      <Button type="submit">Войти</Button>
    </Form>
  );
};
