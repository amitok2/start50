import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function BudgetPlanner() {
  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', name: 'מכירות', amount: 0, type: 'income' },
    { id: '2', name: 'שיווק ופרסום', amount: 0, type: 'expense' },
    { id: '3', name: 'שכר ופרילנסרים', amount: 0, type: 'expense' },
    { id: '4', name: 'תפעול וציוד', amount: 0, type: 'expense' },
  ]);
  
  const [newItemName, setNewItemName] = useState('');
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const updateAmount = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setItems(items.map(item => 
      item.id === id ? { ...item, amount: numValue } : item
    ));
  };

  const addItem = (type: 'income' | 'expense') => {
    if (!newItemName.trim()) return;
    
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: newItemName,
      amount: 0,
      type
    };
    
    setItems([...items, newItem]);
    setNewItemName('');
    setShowAddIncome(false);
    setShowAddExpense(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getTotalIncome = () => {
    return items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpenses = () => {
    return items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getProfit = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.green[500], theme.colors.blue[500], theme.colors.purple[500]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="calculator" size={64} color="white" />
          <Text style={styles.heroTitle}>מתכנן תקציב</Text>
          <Text style={styles.heroSubtitle}>
            נהלי את התקציב של העסק שלך בחכמה
          </Text>
        </View>
      </LinearGradient>

      {/* Summary */}
      <View style={styles.summarySection}>
        <Card style={styles.summaryCard}>
          <CardContent>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>הכנסות</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.green[600] }]}>
                  {formatCurrency(getTotalIncome())}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>הוצאות</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.red[600] }]}>
                  {formatCurrency(getTotalExpenses())}
                </Text>
              </View>
            </View>
            
            <View style={styles.profitSection}>
              <Text style={styles.profitLabel}>רווח חודשי</Text>
              <Text style={[
                styles.profitValue,
                { color: getProfit() >= 0 ? theme.colors.green[700] : theme.colors.red[700] }
              ]}>
                {formatCurrency(getProfit())}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Income Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>מקורות הכנסה</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddIncome(!showAddIncome)}
          >
            <Ionicons name="add-circle" size={28} color={theme.colors.green[500]} />
          </TouchableOpacity>
        </View>

        {showAddIncome && (
          <Card style={styles.addCard}>
            <CardContent>
              <Input
                placeholder="שם מקור הכנסה"
                value={newItemName}
                onChangeText={setNewItemName}
                style={styles.input}
              />
              <View style={styles.addButtonRow}>
                <Button
                  variant="outline"
                  onPress={() => {
                    setShowAddIncome(false);
                    setNewItemName('');
                  }}
                  style={{ flex: 1 }}
                >
                  <Text>ביטול</Text>
                </Button>
                <Button
                  onPress={() => addItem('income')}
                  style={{ flex: 1 }}
                >
                  <Text style={{ color: 'white' }}>הוספה</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {items.filter(item => item.type === 'income').map(item => (
          <Card key={item.id} style={styles.itemCard}>
            <CardContent>
              <View style={styles.itemRow}>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.colors.red[500]} />
                </TouchableOpacity>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemInputContainer}>
                    <Text style={styles.currencySymbol}>₪</Text>
                    <Input
                      keyboardType="numeric"
                      value={item.amount > 0 ? item.amount.toString() : ''}
                      onChangeText={(value) => updateAmount(item.id, value)}
                      placeholder="0"
                      style={styles.amountInput}
                    />
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Expense Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>הוצאות</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddExpense(!showAddExpense)}
          >
            <Ionicons name="add-circle" size={28} color={theme.colors.red[500]} />
          </TouchableOpacity>
        </View>

        {showAddExpense && (
          <Card style={styles.addCard}>
            <CardContent>
              <Input
                placeholder="שם סוג הוצאה"
                value={newItemName}
                onChangeText={setNewItemName}
                style={styles.input}
              />
              <View style={styles.addButtonRow}>
                <Button
                  variant="outline"
                  onPress={() => {
                    setShowAddExpense(false);
                    setNewItemName('');
                  }}
                  style={{ flex: 1 }}
                >
                  <Text>ביטול</Text>
                </Button>
                <Button
                  onPress={() => addItem('expense')}
                  style={{ flex: 1 }}
                >
                  <Text style={{ color: 'white' }}>הוספה</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {items.filter(item => item.type === 'expense').map(item => (
          <Card key={item.id} style={styles.itemCard}>
            <CardContent>
              <View style={styles.itemRow}>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.colors.red[500]} />
                </TouchableOpacity>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemInputContainer}>
                    <Text style={styles.currencySymbol}>₪</Text>
                    <Input
                      keyboardType="numeric"
                      value={item.amount > 0 ? item.amount.toString() : ''}
                      onChangeText={(value) => updateAmount(item.id, value)}
                      placeholder="0"
                      style={styles.amountInput}
                    />
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Card style={styles.tipsCard}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="bulb" size={20} color={theme.colors.orange[600]} />
              {' '}טיפים לניהול תקציב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.tipText}>💡 תכנני תקציב גם לחודשים קשים</Text>
            <Text style={styles.tipText}>💡 שמרי תקציב לשיווק (10-20% מההכנסות)</Text>
            <Text style={styles.tipText}>💡 הקצבי תקציב חירום</Text>
            <Text style={styles.tipText}>💡 עקבי אחר ההוצאות בפועל</Text>
          </CardContent>
        </Card>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    paddingVertical: theme.spacing['5xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
  },
  summarySection: {
    padding: theme.spacing.lg,
  },
  summaryCard: {
    ...theme.shadows.xl,
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[200],
    borderWidth: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.gray[300],
  },
  profitSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 2,
    borderTopColor: theme.colors.gray[200],
  },
  profitLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm,
  },
  profitValue: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  addCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.gray[50],
  },
  input: {
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  addButtonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  itemCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    flex: 1,
    textAlign: 'right',
  },
  itemInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  currencySymbol: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.semibold,
  },
  amountInput: {
    width: 100,
    textAlign: 'left',
  },
  tipsCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  tipText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.8,
    marginBottom: theme.spacing.md,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

