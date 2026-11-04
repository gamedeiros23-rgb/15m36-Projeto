import {test,expect} from '@playwright/test';
test('sidebar, module cards, pillars and primary calls to action navigate',async({page},info)=>{
 await page.goto('/');
 for(const [name,path] of [['Treinos','treinos'],['Alimentação','alimentacao'],['Hidratação','hidratacao'],['Calendário','calendario'],['Meus módulos','modulos'],['Visão geral','']]){
  if(info.project.name==='mobile')await page.getByRole('button',{name:'Abrir menu'}).click();
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('link',{name,exact:true}).click();
  await expect(page).toHaveURL(new RegExp(`#/${path}$`));
 }
 await page.getByRole('link',{name:'CONTINUAR MEU DESAFIO'}).click();await expect(page).toHaveURL(/treino\/1$/);
 for(const id of ['comece','alimentacao','ativar','acelerar','evoluir']){await page.goto('/#/modulos');await page.locator(`.module-card[href="#/modulo/${id}"]`).click();await expect(page).toHaveURL(new RegExp(`modulo/${id}$`));await expect(page.locator('h1')).toBeVisible()}
 for(const path of ['treinos','alimentacao','hidratacao']){await page.goto('/');await page.locator(`.pillar-card[href="#/${path}"]`).click();await expect(page).toHaveURL(new RegExp(`${path}$`))}
 await page.goto('/');await page.getByRole('link',{name:'Explorar calendário'}).click();await expect(page).toHaveURL(/calendario$/);
 await page.getByRole('link',{name:'Comece aqui',exact:true}).click();await expect(page).toHaveURL(/modulo\/comece$/);
 if(info.project.name==='mobile'){await page.getByRole('button',{name:'Abrir menu'}).click();await page.screenshot({path:'artifacts/mobile-menu.png'});await page.getByRole('button',{name:'Fechar menu',exact:true}).click();await expect(page.locator('.sidebar')).not.toHaveClass(/open/);await page.getByRole('button',{name:'Abrir menu'}).click();await page.getByRole('button',{name:'Fechar navegação'}).click({position:{x:320,y:400}});await expect(page.locator('.sidebar')).not.toHaveClass(/open/)}
});
