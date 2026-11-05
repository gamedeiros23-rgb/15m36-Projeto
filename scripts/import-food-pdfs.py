"""Extract supplied PDFs into versioned content. Requires pdftotext (Poppler)."""
import json,re,subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def raw(name):
    return subprocess.check_output(['pdftotext','-raw',str(ROOT/'public/media'/name),'-'],text=True).split('\f')
def clean(text):return re.sub(r'\s+',' ',text).strip()
def between(text,start,end):
    assert start in text and end in text,(start,end)
    return text.split(start,1)[1].split(end,1)[0].strip()
def numbered(text,steps=False):
    matches=list(re.finditer(r'(?m)^(0[1-9])\s+' if steps else r'(?<!\S)(\d{2})\s+',text))
    assert [int(m[1]) for m in matches]==list(range(1,len(matches)+1))
    return [clean(text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)]) for i,m in enumerate(matches)]

pages=raw('cozinha-na-rotina-team-medeiros.pdf')
assert len(pages[:48])==48
recipes=[]
meals=['Café da manhã','Almoço','Café da tarde','Jantar']
for number,page in enumerate(pages[5:45],1):
    marker=re.search(r'RECEITA (\d{2}) / [^\n]+\n',page)
    assert marker and int(marker[1])==number
    body=page[marker.end():]
    title,meta=body.split('\n',1)
    method_yield,meta=meta.split('\n',1)
    assert ' | ' in method_yield,number
    method,yield_=method_yield.split(' | ',1)
    prep=clean(between(meta,'Organização:','Cocção / espera:'))
    cook=clean(between(meta,'Cocção / espera:','INGREDIENTES'))
    columns=between(meta,'INGREDIENTES COMO PREPARAR','Utensílios:')
    first_step=re.search(r'(?m)^01\s+',columns)
    assert first_step,number
    ingredients=[clean(x) for x in columns[:first_step.start()].split('•') if clean(x)]
    steps=numbered(columns[first_step.start():],steps=True)
    utensils=clean(between(meta,'Utensílios:','SUBSTITUIÇÕES E VARIAÇÕES'))
    substitutions=clean(between(meta,'SUBSTITUIÇÕES E VARIAÇÕES','COMO SERVIR'))
    serving=clean(between(meta,'COMO SERVIR','CONSERVAÇÃO'))
    storage=clean(between(meta,'CONSERVAÇÃO','Alergênicos e rótulos:'))
    allergens=clean(meta.split('Alergênicos e rótulos:',1)[1])
    assert ingredients and len(steps)>=2 and all([title,prep,cook,utensils,substitutions,serving,storage,allergens]),number
    methods=[m.strip().capitalize() for m in re.split(r'\s*\+\s*|\s+ou\s+',method)]
    temp=re.search(r'\ba (\d+\s*°C)',cook)
    recipes.append(dict(id=f'receita-{number:02d}',number=number,name=clean(title),meal=meals[(number-1)//10],method=method,methods=methods,prepTime=prep,cookTime=cook,yield_=yield_,ingredients=ingredients,steps=steps,utensils=utensils,substitutions=substitutions,serving=serving,storage=storage,allergens=allergens,temperature=temp[1] if temp else None,sourcePage=number+5))
    recipes[-1]['yield']=recipes[-1].pop('yield_')

card=raw('cardapio-4-refeicoes-team-medeiros.pdf')
meal_pages=[1,3,4,5];counts=[12,10,14,14]
principals=[clean(between(card[1],'COMBINAÇÃO PRINCIPAL','ESCOLHA UMA DAS ALTERNATIVAS')),clean(between(card[2],'COMBINAÇÃO PRINCIPAL','01 Arroz')),clean(between(card[4],'COMBINAÇÃO PRINCIPAL','ESCOLHA UMA DAS ALTERNATIVAS')),clean(between(card[5],'COMBINAÇÃO PRINCIPAL','ESCOLHA UMA DAS ALTERNATIVAS'))]
meal_plan=[]
for index,(page_index,count) in enumerate(zip(meal_pages,counts)):
    page=card[page_index]
    if index==1:options=between(page,'VARIE AS COMBINAÇÕES AO LONGO DA SEMANA','SUBSTITUIÇÕES NA PRÁTICA')
    elif index==0:options=between(page,'ESCOLHA UMA DAS ALTERNATIVAS','FRUTAS PARA VARIAR')
    elif index==2:options=between(page,'ESCOLHA UMA DAS ALTERNATIVAS','Como variar:')
    else:options=between(page,'ESCOLHA UMA DAS ALTERNATIVAS','Ajuste individual:')
    choices=numbered(options)
    assert len(choices)==count,(index,len(choices))
    meal_plan.append(dict(id=['cafe-da-manha','almoco','cafe-da-tarde','jantar'][index],name=meals[index],principal=principals[index],alternatives=choices,sourcePage=page_index+1))

substitution_text=between(card[2],'01 Arroz','ATENÇÃO ÀS QUANTIDADES')
substitution_text='01 Arroz'+substitution_text
matches=list(re.finditer(r'(?m)^(\d{2}) (.+)\n',substitution_text))
groups=[]
for i,m in enumerate(matches):
    groups.append(dict(title=clean(m[2]),text=clean(substitution_text[m.end():matches[i+1].start() if i+1<len(matches) else len(substitution_text)])))
assert len(groups)==5

def guide(page_index,start,end):return clean(between(pages[page_index],start,end))
shopping=[]
for start,end in [('Proteínas e laticínios','Grãos, pães e leguminosas'),('Grãos, pães e leguminosas','Hortaliças e tubérculos'),('Hortaliças e tubérculos','Frutas'),('Frutas','Temperos e complementos'),('Temperos e complementos','Confira o que já tem')]:
    shopping.append(dict(title=start,text=guide(45,start,end)))
bases=[]
for start,end in [('Frango cozido e desfiado','Lentilha'),('Lentilha','Grão-de-bico'),('Grão-de-bico','Batata ou batata-doce'),('Batata ou batata-doce','Resfrie em recipientes')]:
    bases.append(dict(title=start,text=guide(46,start,end)))
planning=[]
for start,end in [('1. Escolha e ajuste','2. Prepare e separe'),('2. Prepare e separe','3. Varie com as fichas'),('3. Varie com as fichas','Sobre este material')]:
    planning.append(dict(title=start,text=guide(47,start,end)))
safety=[]
for start,end in [('Higiene e separação','Temperatura no centro do alimento'),('Temperatura no centro do alimento','Geladeira e resfriamento'),('Geladeira e resfriamento','Prazos, congelamento e sobras'),('Prazos, congelamento e sobras','Prefira leite, queijos')]:
    safety.append(dict(title=start,text=guide(2,start,end)))
reading=[]
for start,end in [('Como ler as quantidades','Tempos e ponto de preparo'),('Tempos e ponto de preparo','Forno e air fryer'),('Forno e air fryer','Substituições:')]:
    reading.append(dict(title=start,text=guide(1,start,end)))
reading.append(dict(title='Substituições e alergias',text=clean(pages[1].split('Substituições:',1)[1])))
data=dict(recipes=recipes,mealPlan=meal_plan,substitutionGroups=groups,shopping=shopping,bases=bases,planning=planning,safety=safety,reading=reading,fruitOptions=clean(card[1].split('FRUTAS PARA VARIAR',1)[1]),baseStorage=clean(pages[46].split('Resfrie em recipientes',1)[1]),about=guide(47,'Sobre este material','Referências de segurança alimentar'))
data['baseStorage']='Resfrie em recipientes '+data['baseStorage']
(ROOT/'src/food-content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(f'Importadas {len(recipes)} receitas, {sum(len(m["alternatives"]) for m in meal_plan)} alternativas de refeições e {len(groups)} grupos de substituição.')
for r in recipes:print(f'{r["number"]:02d} | {r["name"]} | {r["method"]} | {len(r["ingredients"])} ingredientes | {len(r["steps"])} etapas | {r["prepTime"]} / {r["cookTime"]}')
