import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "../../locations/entities/location.entity.js";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;

    @Column('text')
    name: string;

    @Column('text')
    lastName: string;

    @Column('text')
    phoneNumber: string;

    @Column('text')
    email: string;

    @Column({
        type: "text",
        nullable: true
    })
    photoUrl: string;

    @ManyToOne("Location", (location: Location) => location.employees)
    @JoinColumn({name: "locationId"})
    location: Location;
}
