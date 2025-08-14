

export const UnitConverter = () => ({
  pz: (a: any, b: any, units: any) => {
    console.log('Entrada:', a, b, units);

    const unit = a;
    const amount = b;

    if (unit == 'PZA') {
      const result = amount;
      console.log('Total de unidades convertidas de piezas a piezas', result);
      return result;
    }

    if (unit == 'CAJA') {
      for (const x of units) {
        if (x.unidad == 'PZA') {
          const result = amount * x.equivalencia;
          console.log('x.equivalencia', x.equivalencia);
          console.log('Total de unidades convertidas de caja a piezas', result);
    
        }
        if (x.unidad == 'CAJA') {
          const result = amount * x.equivalencia;
          console.log('Total de unidades convertidas de piezas a cajas', result);
     
        }
    
      }
    }

    console.error('Unidad no soportada');
    return null;
  }
});

export default UnitConverter;
