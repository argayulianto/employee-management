import { faker } from '@faker-js/faker';

export const User = {
    username: "admin",
    password: "12345",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    status: faker.word.noun()
}