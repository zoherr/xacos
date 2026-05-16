import { XModel, Column } from '@xacos/orm';

/**
 * Default User model for XAOCS Auth.
 */
export class User extends XModel {
  static override table = 'users';
  static override softDeletes = false;

  @Column()
  declare id: number;

  @Column()
  declare name: string;

  @Column()
  declare email: string;

  @Column({ hidden: true }) // never appears in JSON output
  declare password: string;

  @Column()
  declare role: 'user' | 'admin';

  @Column()
  declare email_verified: boolean;

  @Column()
  declare email_verified_at: Date | null;

  @Column()
  declare created_at: Date;

  @Column()
  declare updated_at: Date;
}

