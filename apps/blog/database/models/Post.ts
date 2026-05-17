import { XModel, Column, BelongsTo, HasMany, BelongsToMany } from '@xacos/orm';
import { User } from '@xacos/auth';
import { Comment } from './Comment';

export class Post extends XModel {
  static table = 'posts';

  @Column() declare id: number;
  @Column() declare author_id: number;
  @Column() declare title: string;
  @Column() declare slug: string;
  @Column() declare excerpt: string | null;
  @Column() declare body: string;
  @Column() declare status: 'draft' | 'published' | 'archived';
  @Column() declare cover_image: string | null;
  @Column() declare views: number;
  @Column() declare created_at: Date;
  @Column() declare updated_at: Date;

  @BelongsTo(() => User, 'author_id')
  declare author: User;

  @HasMany(() => Comment, 'post_id')
  declare comments: Comment[];

  // Slug generation helper
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
