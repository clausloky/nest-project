import { Column, Entity, JoinColumn, ManyToOne, OneToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Manager } from "../../managers/entities/manager.entity.js";
import { Region } from "../../regions/entities/region.entity.js";
import { Employee } from "../../employees/entities/employee.entity.js";

@Entity()
export class Location {
    @PrimaryGeneratedColumn("increment")
    locationId: number;
    @Column("text")
    locationName: string;
    @Column("text")
    locationAdress: string;
    @Column("simple-array")
    locationLatLng: number[];

    @OneToOne("Manager", (manager: Manager) => manager.location)
    @JoinColumn({
        name: "managerId"
    })
    manager: Manager

    @ManyToOne("Region", (region: Region) => region.locations)
    @JoinColumn({ name: "regionId" })
    region: Region;

    @OneToMany("Employee", (employee: Employee) => employee.location)
    employees: Employee[];
}
