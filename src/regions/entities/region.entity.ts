import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Location } from '../../locations/entities/location.entity.js';

@Entity()
export class Region {
  @PrimaryGeneratedColumn('increment')
  regionId: number;

  @Column('text')
  regionName: string;

  @Column('simple-array')
  regionStates: string[];

  @OneToMany('Location', (location: Location) => location.region)
  locations: Location[];
}
