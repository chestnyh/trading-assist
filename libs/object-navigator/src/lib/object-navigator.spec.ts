import ObjectNavigator  from './object-navigator';

describe('TradingDataService', () => {
  let service: ObjectNavigator;

  beforeEach(() => {
    service = new ObjectNavigator();
  });

  describe('set()', () => {

    it('should set a simple property', () => {
      const key = 'name';
      const value = 'Alice'
      service.set(key, value);
      expect(service['data']).toEqual({[key]: value});
    });

    it('should set a nested object property', () => {
      const nestedKey = `user.profile.age`;
      const value = 30;
      const expectedValue = {
        user: {
          profile: {
            age: value
          }
        }
      }
      service.set(nestedKey, value);
      expect(service['data']).toEqual(expectedValue);
    });

    it('should set an array element', () => {
      const keyWithArray = 'users.[0]';
      const value = { name: 'Bob' };
      const expectedValue = {
        users: [
          { name: 'Bob' }
        ]
      }
      service.set(keyWithArray, value);
      expect(service['data']).toEqual(expectedValue);
    });

    it('should push to the end of an array', () => {

      const keyWithArray = 'users.[]';
      const value1 = { name: 'Charlie' };
      const value2 = { name: 'David' };
      const expectedValue = {
        users: [
          value1,
          value2
        ]
      }

      service.set(keyWithArray, value1);
      service.set(keyWithArray, value2);
      expect(service['data']).toEqual(expectedValue);

    });

    it('should handle mixed object and array paths', () => {

      const key = 'company.departments.[].employees.[].position';
      const value = 'Manager';
      const expectedValue = {
        company: {
          departments: [
            {
              employees: [
                { position: 'Manager' }
              ]
            }
          ]
        }
      };

      service.set(key, value);
      expect(service['data']).toEqual(expectedValue);
    });
  });

  describe('get()', () => {

    describe('nesting level 1', () => {

      describe('object_property', () => {

        beforeEach(() => {
          service['data'] = { name: 'Alice'};
        });

        it('should get a specified value', () => {
          expect(service.get('name')).toBe('Alice');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('nonexistent', 'some_default')).toBe('some_default');
        });

      });

      describe('array_item', () => {

        beforeEach(() => {
          service['data'] = [
            { value: 8 },
            { value: 14 },
            { value: "text" },
            { value: true },
            { value: null }
          ];
        });

        it('should get a specified value', () => {
          expect(service.get('[0].value')).toBe(8);
          expect(service.get('[1].value')).toBe(14);
          expect(service.get('[2].value')).toBe("text");
          expect(service.get('[3].value')).toBe(true);
          expect(service.get('[4].value')).toBe(null);
          expect(service.get('[].value')).toBe(null);
         
          expect(service.get('[0].value', 'some_default')).toBe(8);
          expect(service.get('[1].value', 'some_default')).toBe(14);
          expect(service.get('[2].value', 'some_default')).toBe("text");
          expect(service.get('[3].value', 'some_default')).toBe(true);
          expect(service.get('[4].value', 'some_default')).toBe(null);
          expect(service.get('[].value', 'some_default')).toBe(null);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[5].value')).toBeUndefined();
          expect(service.get('nonexistent.this.and.this.and.this')).toBeUndefined();
          expect(service.get('nonexistent.[].value')).toBeUndefined();
          expect(service.get('[].nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[5].value', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.this.and.this.and.this', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.[].value', 'some_default')).toBe('some_default');
          expect(service.get('[].nonexistent', 'some_default')).toBe('some_default');
        });
      });

    });

    describe('nesting level 2', () => {
      describe('object_property.object_property', () => {
        beforeEach(() => {
          service['data'] = {
            company: {
              departments: [
                { name: 'IT' }
              ],
              name: 'ACME',
              isActive: true,

            },
            user: {
              age: 30,
              name: 'Alice',
              isActive: true
            }
          };
        });

        it('should get a specified value', () => {
          expect(service.get('company.name')).toBe('ACME');
          expect(service.get('user.name')).toBe('Alice'); 
          expect(service.get('company.departments')).toEqual([{name:'IT'}]);
          expect(service.get('user.isActive')).toBe(true);
          expect(service.get('company.isActive')).toBe(true);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('company.nonexistent')).toBeUndefined();
          expect(service.get('user.nonexistent')).toBeUndefined();
          expect(service.get('company.departments.nonexistent')).toBeUndefined();
          expect(service.get('user.isActive.nonexistent')).toBeUndefined();
          expect(service.get('company.isActive.nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('company.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.departments.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.isActive.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.isActive.nonexistent', 'some_default')).toBe('some_default');
        });
      });

      describe('object_property.array_item', () => {
        beforeEach(() => {
          service['data'] = {
            items: [
              { name: 'Alice' },
              11231223, 
              false,
              null,
              'some_string'
            ]
          };
        });
        it('should get a specified value', () => {
          expect(service.get('items.[0]')).toEqual({name: 'Alice'});
          expect(service.get('items.[1]')).toBe(11231223);
          expect(service.get('items.[2]')).toBe(false);
          expect(service.get('items.[3]')).toBe(null);
          expect(service.get('items.[4]')).toBe('some_string');
          expect(service.get('items.[]')).toBe('some_string');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('items.[5]')).toBeUndefined();
          expect(service.get('items.nonexistent')).toBeUndefined();
          expect(service.get('items.[].nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('items.[5]', 'some_default')).toBe('some_default');
          expect(service.get('items.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('items.[].nonexistent', 'some_default')).toBe('some_default');
        });
      });

      describe('array_item.object_property', () => {

        beforeEach(() => {
          service['data'] = [
            [
              { name: 'Alice' },
              { name: 'Bob' },
              { name: 'Charlie' }
            ],
            [
              { name: 'Dave' },
              { name: 'Eve' },
              { name: 'Frank' }
            ],
            [
              { name: 'George' },
              { name: 'Hank' },
              { name: 'Ian' }
            ]
          ];
        });

        it('should get a specified value', () => {
          expect(service.get('[].[].name')).toBe('Ian');
          expect(service.get('[1].[2].name')).toBe('Frank');
          expect(service.get('[2].[0].name')).toBe('George');
          expect(service.get('[].[1].name')).toBe('Hank');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[0].name')).toBeUndefined();
          expect(service.get('[].[1].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[].[].nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.and.this.and.this.and.this')).toBeUndefined();
          expect(service.get('nonexistent.[].some.[].value')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[0].name', 'some_default')).toBe('some_default');
          expect(service.get('[].[1].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[].[].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.and.this.and.this.and.this', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.[].some.[].value', 'some_default')).toBe('some_default');
        });
      });

      describe('array_item.array_item', () => {
        beforeEach(() => {
          service['data'] = [
            [true, false, true],
            [4, 5, 'yellow'],
            [7, {name: 'Brad'}, 9]
          ];
        });
        it('should get a specified value', () => {
          expect(service.get('[0].[0]')).toBe(true);
          expect(service.get('[].[1]')).toEqual({name: 'Brad'});
          expect(service.get('[0].[1]')).toBe(false);
          expect(service.get('[2].[1]')).toEqual({name: 'Brad'}); 
          expect(service.get('[2].[]')).toBe(9);
          expect(service.get('[].[]')).toBe(9);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[0]')).toBeUndefined();
          expect(service.get('[3].[]')).toBeUndefined();
          expect(service.get('[].[2].nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[0]', 'some_default')).toBe('some_default');
          expect(service.get('[3].[]', 'some_default')).toBe('some_default');
          expect(service.get('[].[2].nonexistent', 'some_default')).toBe('some_default');
        });
      }); 

    });

    describe('nesting level 3', () => {
      describe('object_property.object_property.object_property', () => {

        beforeEach(() => {
          service['data'] = {
            user: {
              profile: { 
                age: 30,
                name: 'Alice',
                isActive: true
              },
              cart: {
                itemsCount: 3,
                total: 120
              }
            },
            company: {
              mainDepartment: {
                name: 'Main Department',
                isActive: true
              }
            }
          };
        });

        it('should get a specified value', () => {
          expect(service.get('user.profile.name')).toBe('Alice');
          expect(service.get('user.cart.itemsCount')).toBe(3);
          expect(service.get('company.mainDepartment.name')).toBe('Main Department'); 
          expect(service.get('user.profile.isActive')).toBe(true);
          expect(service.get('company.mainDepartment.isActive')).toBe(true);
          expect(service.get('user.cart.total')).toBe(120);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('user.profile.nonexistent')).toBeUndefined();
          expect(service.get('user.cart.nonexistent')).toBeUndefined();
          expect(service.get('company.mainDepartment.nonexistent')).toBeUndefined();
          expect(service.get('user.profile.isActive.nonexistent')).toBeUndefined();
          expect(service.get('company.mainDepartment.isActive.nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('user.profile.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.cart.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.mainDepartment.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('user.profile.isActive.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('company.mainDepartment.isActive.nonexistent', 'some_default')).toBe('some_default');
        });
      });

      describe('object_property.object_property.array_item', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('object_property.array_item.object_property', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('array_item.object_property.object_property', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('array_item.object_property.array_item', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

      describe('array_item.array_item.object_property', () => {

        beforeEach(() => {
          service['data'] = [
            [
              { name: 'Alice' },
              { name: 'Bob' },
              { name: 'Charlie' }
            ],
            [
              { name: 'Dave' },
              { name: 'Eve' },
              { name: 'Frank' }
            ],
            [
              { name: 'George' },
              { name: 'Hank' },
              { name: 'Ian' }
            ]
          ];
        });
        it('should get a specified value', () => {
          expect(service.get('[].[].name')).toBe('Ian');
          expect(service.get('[1].[2].name')).toBe('Frank');
          expect(service.get('[2].[0].name')).toBe('George');
          expect(service.get('[].[1].name')).toBe('Hank');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[0].name')).toBeUndefined();
          expect(service.get('[].[1].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[].[].nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.and.this.and.this.and.this')).toBeUndefined();
          expect(service.get('nonexistent.[].some.[].value')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[0].name', 'some_default')).toBe('some_default');
          expect(service.get('[].[1].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[].[].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.and.this.and.this.and.this', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.[].some.[].value', 'some_default')).toBe('some_default');
        });
      });

      describe('array_item.array_item.array_item', () => {
        it('should get a specified value', () => {
          // TODO
        });

        it('should return undefined for a non-existent', () => {
          // TODO
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO
        });
      });

    });

    describe('nesting level 4', () => {

      describe('object_property.object_property.object_property.object_property', () => {

        beforeEach(() => {
          service['data'] = {
            settings: {
              theme: {
                mode: {
                  type: 'dark'
                }
              }
            }
          };
        });

        it('should get a specified value', () => {
          expect(service.get('settings.theme.mode.type')).toBe('dark');
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('settings.theme.mode.nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.nonexistentToo.andThisOneToo.andTheLastOne')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('settings.theme.mode.nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('nonexistent.nonexistentToo.andThisOneToo.andTheLastOne', 'some_default')).toBe('some_default');
        });

      });

      describe('object_property.object_property.object_property.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order object_property.object_property.array_item.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order object_property.array_item.object_property.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.object_property.object_property.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
            });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });


      describe('order array_item.object_property.object_property.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
          });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.object_property.array_item.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
          });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
          });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.array_item.object_property.object_property', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
          });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
          });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.array_item.object_property.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here
          });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here
          });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here
        });

      });

      describe('order array_item.array_item.array_item.object_property', () => {

        beforeEach(() => {
          service['data'] = [
            [
              [{price: 23}, {price: 7}, {price: 15} ],
              [{price: 4}, {price: 19}, {price: 11}],
              [{price: 26}, {price: 9}, {price: 1}]
            ],
            [
              [{price: 18}, {price: 3}, {price: 25}],
              [{price: 13}, {price: 6}, {price: 21}],
              [{price: 10}, {price: 27}, {price: 16}]
            ],
            [
              [{price: 8}, {price: 20}, {price: 2}],
              [{price: 14}, {price: 5}, {price: 24}],
              [{price: 12}, {price: 22}, {price: 17}]
            ]
          ];
        });

        it('should get a specified value', () => {
          expect(service.get('[].[].[].price')).toBe(17);
          expect(service.get('[2].[2].[2].price')).toBe(17);
          expect(service.get('[2].[0].[1].price')).toBe(20);
          expect(service.get('[0].[0].[0].price')).toBe(23);
          expect(service.get('[2].[].[2].price')).toBe(17);
          expect(service.get('[].[2].[1].price')).toBe(22);
          expect(service.get('[].[].[0].price')).toBe(12);
        });

        it('should return undefined for a non-existent', () => {
          expect(service.get('[3].[2].[2].price')).toBeUndefined();
          expect(service.get('[].[2].[5].price')).toBeUndefined();
          expect(service.get('[].[].[100].price')).toBeUndefined();
          expect(service.get('[2].[2].[2].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[0].nonexistent')).toBeUndefined();
          expect(service.get('[].[].[].nonexistent')).toBeUndefined();
        });
        
        it('should return a specified default value for a non-existent', () => {
          expect(service.get('[3].[2].[2].price', 'some_default')).toBe('some_default');
          expect(service.get('[].[2].[5].price', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[100].price', 'some_default')).toBe('some_default');
          expect(service.get('[2].[2].[2].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[0].nonexistent', 'some_default')).toBe('some_default');
          expect(service.get('[].[].[].nonexistent', 'some_default')).toBe('some_default');
        });

      });

      describe('order array_item.array_item.array_item.array_item', () => {

        it('should get a specified value', () => {
          // TODO add test cases here 
        });

        it('should return undefined for a non-existent', () => {
          // TODO add test cases here 
        });
        
        it('should return a specified default value for a non-existent', () => {
          // TODO add test cases here 
        });

      });

    });

  });

  describe.skip('edge cases', () => {
    it('should handle empty string keys', () => {
      service.set('', 'root');
      expect(service.get('')).toBe('root');
    });

    it('should handle numeric keys', () => {
      service.set('0', 'zero');
      expect(service.get('0')).toBe('zero');
    });

    it('should throw error when trying to push to a non-array', () => {
      service['data'] = {
        'notAnArray': {}
      };
      expect(() => service.set('notAnArray.[]', 'value')).toThrow('Cannot push to a non-array');
    });
  });
});