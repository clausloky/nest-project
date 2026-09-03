import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Injectable()
export class EmployeesService {

  private employees: CreateEmployeeDto[] = [
    {
      id: 1,
      name: "Tristan",
      lastName: "Garcia",
      phoneNumber: "123971294"
    }
  ];

  create(createEmployeeDto: CreateEmployeeDto) {
    this.employees.push(createEmployeeDto);
    return this.employees;
  }

  findAll() {
    return this.employees;
  }

  findOne(id: number) {
    return this.employees.filter((employee) => employee.id == id)[0];
  }

  // Preferi utilizar un nuevo data, para reemplazar completamente el anterior
  update(id: number, createEmployeeDto: CreateEmployeeDto) { 
    this.employees = this.employees.map((employee) => {
      if (employee.id === id) {
        return createEmployeeDto;
      }

      return employee;
    });

    return this.employees;
  }

  remove(id: number) {
    this.employees = this.employees.filter((employee) => employee.id !== id);
    return this.employees;
  }

  getFibonnaci() {
    const fibonacciNumbers : number[] = []

    fibonacciNumbers.push(0, 1);

    const n : number = 10;
    for (let i : number = 2; i < n; i++) {
      fibonacciNumbers[i] = fibonacciNumbers[i - 1] + fibonacciNumbers[i - 2];
    }

    return fibonacciNumbers;
  }
}
