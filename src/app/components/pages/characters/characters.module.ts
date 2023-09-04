import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CharacterListComponent } from '@characters/character-list/character-list.component';
import { CharacterDetailsComponent } from '@characters/character-details/character-details.component';
import { RouterModule } from '@angular/router';
import { CharacterComponent } from './character.component';

const myComponent = [
  CharacterDetailsComponent, 
  CharacterListComponent,
  CharacterComponent
]

@NgModule({
  declarations: [...myComponent],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [...myComponent],
})
export class CharactersModule { }
