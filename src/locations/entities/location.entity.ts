import { Column, Entity, JoinColumn, ManyToOne, OneToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Manager } from "../../managers/entities/manager.entity.js";
import { Region } from "../../regions/entities/region.entity.js";
import { Employee } from "../../employees/entities/employee.entity.js";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Location {
    @PrimaryGeneratedColumn("increment")
    locationId: number;

    @ApiProperty({
        default: "Ocso juriquilla"
    })
    @Column("text")
    locationName: string;

    @ApiProperty({
        default: "Avenida tal, S/N"
    })
    @Column("text")
    locationAdress: string;

    @ApiProperty({
        default: [12, 12]
    })
    @Column("simple-array")
    locationLatLng: number[];

    @ApiProperty({default: "1b1434ad-5e6c-4ee3-806d-74406d65c714"})
    @OneToOne("Manager", (manager: Manager) => manager.location)
    @JoinColumn({
        name: "managerId"
    })
    manager: Manager | string

    @ManyToOne("Region", (region: Region) => region.locations)
    @JoinColumn({ name: "regionId" })
    region: Region;

    @OneToMany("Employee", (employee: Employee) => employee.location)
    employees: Employee[];
}
