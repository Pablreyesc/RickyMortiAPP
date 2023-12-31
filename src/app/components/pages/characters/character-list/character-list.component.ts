import { Component, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Character } from '@app/shared/interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
import { take,filter } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';

type RequestInfo = {
  next:string;
};
@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent{
  characters:Character[] = [];
  info: RequestInfo={
    next:'',
  };
  showGoUpButton = false;
  private pageNum= 1;
  private query!: string;
  private hideScrollHeigth = 200;
  private showScrollHeigth = 500;

  constructor(private characterSvc: CharacterService,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router
    ){
      this.onUrlChanged();
    }
  ngOnInit(): void{
    this.getCharactersByQuery();
  }

  

  @HostListener('window:scroll', [])
  onWindowScroll():void {
    const yOffSet = window.pageYOffset;
    if ((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeigth) {
      this.showGoUpButton = true;
    } else if (this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.hideScrollHeigth) {
      this.showGoUpButton = false;
    }
  }

  onScrollDown():void{
    if (this.info.next) {
      this.pageNum++;
      this.getDataFromService();
    }
  }

  onScrollTop():void{
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0; // Other
  }

  private onUrlChanged(): void{
    this.router.events.pipe(filter((event)=> event instanceof NavigationEnd)).subscribe(() => {
      this.characters=[];
      this.pageNum=1;
      this.getCharactersByQuery();
    });
  }
  private getCharactersByQuery():void{
    this.route.queryParams.pipe(take(1)).subscribe((params: any) => {
      //se reemplaza valor ParamMap por any para hacer funcionar el metodo
      console.log('Params->', params);
      this.query = params['q'];
      this.getDataFromService();
    });
  }

  private getDataFromService (): void{
    this.characterSvc.searchCharacters(this.query, this.pageNum)
    .pipe(
      take(1)
    ).subscribe((res:any) => {
      if (res?.results?.length){
        const {info, results} = res;
        this.characters = [...this.characters, ...results];
        this.info = info;
      }else{
        this.characters = [];
      }
      
    });
  }
}
