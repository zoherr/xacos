import { XModel, Column, BelongsTo } from '@xacos/orm';
import { User } from '@xacos/auth';
import { Post } from './Post';

export class Comment extends XModel {
  static table = 'comments';

  @Column() declare id: number;
  @Column() declare post_id: number;
  @Column() declare author_id: number;
  @Column() declare body: string;
  @Column() declare created_at: Date;
  @Column() declare updated_at: Date;

  @BelongsTo(() => Post, 'post_id')
  declare post: Post;

  @BelongsTo(() => User, 'author_id')
  declare author: User;
}
