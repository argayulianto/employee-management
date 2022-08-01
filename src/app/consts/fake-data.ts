import { faker } from '@faker-js/faker';
import { Employee } from '../shared/model/employee';

export function createRandomEmployee(): Employee {
    return {
        username: faker.word.adjective(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate(),
        basicSalary: faker.datatype.number(),
        status: faker.word.noun(),
        group: faker.company.companyName(),
        description: faker.date.recent()
    }
}